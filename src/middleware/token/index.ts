import * as Koa from 'koa';
import { resolveToken } from '../../libs';

export const token: Koa.Middleware = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const result = resolveToken(ctx.request.headers.authorization);
    if (result) {
      ctx.request.uid = result;
    }
  }
  await next();
};
