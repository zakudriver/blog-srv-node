import * as Koa from 'koa';
import * as Jwt from 'jsonwebtoken';
import { Event, Status } from '../../constants/enum';

export const token: Koa.Middleware = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    ctx.io.getHttpToken(ctx.request.headers.authorization);
    const clientTokenStr = ctx.request.headers.authorization.split(' ')[1] || '';
    const result = resolveToken(clientTokenStr);
    if (result) {
      ctx.request.uid = result;
    }
  }
  await next();
};

/**
 * 解析token获取uid
 *
 * @export
 * @param {string} tokenStr
 * @returns
 */
export function resolveToken(tokenStr: string) {
  if (tokenStr) {
    const clientToken: any = Jwt.decode(tokenStr, { complete: true }) || { payload: null };
    if (clientToken.payload) {
      return clientToken.payload.userId;
    }
  }

  return;
}
