import * as Koa from 'koa';
import * as Jwt from 'jsonwebtoken';
import { RootMod } from '../../db/model';

let rootList: any;

export const root: Koa.Middleware = async (ctx, next) => {
  if (ctx.request.headers.authorization) {
    const clientTokenStr = ctx.request.headers.authorization.split(' ')[1] || false;
    if (clientTokenStr) {
      const clientToken: any = Jwt.decode(clientTokenStr, { complete: true }) || { payload: null };
      if (clientToken.payload) {
        ctx.request.uid = clientToken.payload.userId;
        await rootAuth(ctx, clientToken.payload.userId);
      }
    }
  }
  await next();
};

async function rootAuth(ctx: Koa.Context, uid: string) {
  if (!rootList) {
    rootList = await RootMod.find();
  }
  console.log(rootList);

  // if (res) {
  //   ctx.request.root = true;
  // } else {
  //   ctx.request.root = false;
  // }
}
