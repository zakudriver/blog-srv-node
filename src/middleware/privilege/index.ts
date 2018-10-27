import * as Router from 'koa-router';
import { Privilege } from '../../constants/enum';
import { UserMod } from '../../db/model';

export const privilege: Router.IMiddleware = async (ctx, next) => {
  const uid = ctx.request.uid;
};
