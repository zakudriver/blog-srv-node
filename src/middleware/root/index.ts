import * as Koa from 'koa';
import { RootMod } from '../../db/model';
import { Response } from '../../constants/enum';

export const root: Koa.Middleware = async (ctx, next) => {
  const overtimeRes = {
    code: Response.overtime,
    data: null,
    msg: 'Logon failure'
  };
  if (!ctx.request.headers.authorization) {
    return (ctx.body = overtimeRes);
  }

  if (!ctx.request.headers.authorization.split(' ')[1]) {
    return (ctx.body = overtimeRes);
  }

  const clientTokenStr = ctx.request.headers.authorization.split(' ')[1];
  // const clientToken: any = Jwt.decode(clientTokenStr, { complete: true });

  // if (ctx.request.uid) {
  //   const uid = ctx.request.uid;
  //   const res = await RootMod.find(uid);
  //   if (res) {
  //     ctx.request.root = true;
  //   } else {
  //     ctx.request.root = false;
  //   }
  // } else {
  //   ctx.request.root = false;
  // }
};
