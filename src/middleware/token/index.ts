import * as Koa from 'koa';
import * as Jwt from 'jsonwebtoken';

export const token: Koa.Middleware = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const clientTokenStr = ctx.request.headers.authorization.split(' ')[1] || false;
    if (clientTokenStr) {
      const clientToken: any = Jwt.decode(clientTokenStr, { complete: true }) || { payload: null };
      if (clientToken.payload) {
        ctx.request.uid = clientToken.payload.userId;
      }
    }
  }
  await next();
};
