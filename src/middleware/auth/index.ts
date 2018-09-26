import * as Router from 'koa-router';
import * as Jwt from 'jsonwebtoken';
import redis from '../../redis';
import { errLog, terminalLog } from '../../libs/log';
import config from '../../config';

const jwt = config.get('jwt');

// interface IVerifyToken {
//   (ctx: Koa.Context, decodedToken: object, token: string): Promise<boolean>;
// }

// /**
//  * 验证token
//  * @param ctx
//  * @param decodedToken
//  * @param token
//  */
// export const verifyToken: IVerifyToken = (ctx, decodedToken, token) => {
//   const jwtConfig = config.get('jwt');
//   console.log('verify');
//   return Promise.resolve(true);

//   try {
//     // const tkn = Jwt.verify(token, jwtConfig.secret);
//     // console.log(tkn);
//     ctx.body = {
//       msg: 'token过期'
//     };

//     return Promise.resolve(false);
//   } catch (e) {
//     ctx.throw(401, 'Invalid token, please restart');
//     return Promise.resolve(true);
//   }
// };

/**
 * 生成token
 * @param userId 用户id
 */
export function signToken(userId: string) {
  const jwtConfig = config.get('jwt');
  const token = Jwt.sign({ userId }, jwtConfig.secret, { algorithm: 'HS512' });
  return token;
}

/**
 * 验证token
 * @param ctx
 * @param next
 */
export const verifyToken: Router.IMiddleware = async (ctx, next) => {
  const overtimeRes = {
    code: 1,
    data: null,
    msg: '登陆失效，请重新登陆'
  };

  const clientTokenStr = ctx.request.headers.authorization.split(' ')[1];
  const clientToken: any = Jwt.decode(clientTokenStr, { complete: true });

  if (clientTokenStr && clientToken.payload.userId) {
    const nowTime = new Date().getTime();

    // redis获取token
    const redisTokenStr = await redis.getAsync(clientToken.payload.userId);
    if (!redisTokenStr) {
      return (ctx.body = overtimeRes);
    }
    const redisToken = JSON.parse(redisTokenStr);
    const difference = nowTime - redisToken.time;
    const over = await redis.ttlAsync(clientToken.payload.userId);
    terminalLog(`token过期时间：${over}`);

    if (redisToken.token === clientTokenStr) {
      if (difference <= jwt.settlingtime) {
        await next();
      } else if (difference > jwt.settlingtime && difference <= jwt.overtime) {
        // 重置过期时间
        await redis.setAsync(
          clientToken.payload.userId,
          JSON.stringify({ token: clientTokenStr, time: new Date().getTime() })
        );
        const result = await redis.pexpireAsync(clientToken.payload.userId, jwt.overtime - jwt.settlingtime);
        if (result) {
          await next();
        } else {
          errLog('redis pexpireAsync error');
        }
      }
    } else {
      ctx.body = overtimeRes;
    }
  } else {
    ctx.body = overtimeRes;
  }
};
