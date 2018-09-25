import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Jwt from 'jsonwebtoken';
import redis from '../redis';
import config from '../../config';
import { resolve } from 'dns';

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
  const token = ctx.request.headers.authorization.split(' ')[1];

  console.log(token);
  if (!token) {
    return (ctx.body = {
      code: 1,
      data: null,
      msg: '登陆失效，请重新登陆'
    });
  } else {
    console.log('token');

    const tokenObj: any = Jwt.decode(token, { complete: true });
    if (tokenObj && tokenObj.payload && tokenObj.payload.time && tokenObj.payload.userId) {
      const nowTime = new Date().getTime();
      const difference = nowTime - tokenObj.payload.time;
      console.log(111);

      const a = await Promise.resolve(
        redis.get(tokenObj.payload.userId, async (err, val) => {
          console.log('val');
          console.log(val ? 1 : 0);
          if (err) {
            ctx.body = {
              code: 1,
              data: null,
              msg: err
            };
          }
          if (val === token) {
            console.log(difference);
            console.log(jwt.settlingtime);

            if (difference <= jwt.settlingtime) {
              console.log(jwt.settlingtime);
              await next();
            } else if (difference > jwt.settlingtime && difference <= jwt.overtime) {
              // redis
              await redis.expire(tokenObj.payload._id, (jwt.overtime - jwt.settlingtime) / 1000);
              await next();
            } else {
              ctx.body = {
                code: 1,
                data: null,
                msg: '登陆失效，请重新登陆'
              };
            }
          } else {
            ctx.body = {
              code: 1,
              data: null,
              msg: '登陆失效，请重新登陆'
            };
          }
        })
      );
      console.log(a);
    } else {
      ctx.body = {
        code: 1,
        data: null,
        msg: '登陆失效，请重新登陆'
      };
    }
  }
};
