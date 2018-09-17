import * as Koa from 'koa';
import * as Jwt from 'jsonwebtoken';

interface IVerifyToken {
  (ctx: Koa.Context, decodedToken: object, token: string): Promise<boolean>;
}

/**
 * 验证token
 * @param ctx 
 * @param decodedToken 
 * @param token 
 */
export const verifyToken: IVerifyToken = (ctx, decodedToken, token) => {
  try {
    return Promise.resolve(false);
  } catch (e) {
    ctx.throw(401, 'Invalid token, please restart');
    return Promise.resolve(true);
  }
};
