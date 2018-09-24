import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Jwt from 'jsonwebtoken';
import redis from '../redis';
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
  const token = Jwt.sign({ userId, time: new Date().getTime() }, jwtConfig.secret, { algorithm: 'HS512' });
  return token;
}

/**
 * 验证token
 * @param ctx
 * @param next
 */
export const verifyToken: Router.IMiddleware = async (ctx, next) => {
  console.log('auth');
  let token = ctx.request.headers.authorization;

  console.log(token);
  if (!token) {
    return (ctx.body = {
      code: 1,
      data: null,
      msg: '登陆失效，请重新登陆'
    });
  } else {
    token = token.split(' ')[1];
    const payload = (Jwt.decode(token, { complete: true }) as any).payload;
    const nowTime = new Date().getTime();
    const difference = nowTime - payload.time;

    await redis.get(payload.userId, async (err, val) => {
      if (val === token) {
        if (difference <= jwt.settlingtime) {
          await next();
        } else if (difference > jwt.settlingtime && difference <= jwt.overtime) {
          // redis
        } else {
          return (ctx.body = {
            code: 1,
            data: null,
            msg: '登陆失效，请重新登陆'
          });
        }
      } else {
        return (ctx.body = {
          code: 1,
          data: null,
          msg: '登陆失效，请重新登陆'
        });
      }
    });
  }

  await next();
};
