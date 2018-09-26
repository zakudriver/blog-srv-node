import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { MessageMod } from '../db/model';
import { trycatch } from '../libs/utils';

@prefix('/message')
export default class MessageController {
  @router({
    path: '',
    method: 'get'
  })
  @auth
  @log
  async getMessage(ctx: Koa.Context) {
    let { index, limit } = ctx.query;
    index = +index;
    limit = +limit;

    await trycatch(ctx, async () => {
      const count = await MessageMod.countDocuments({});
      const results = await MessageMod.find({})
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({ _id: -1 })
        .exec();

      ctx.body = {
        code: 0,
        data: {
          rows: results,
          count
        },
        msg: 'message,拿好'
      };
    });
  }

  @router({
    path: '',
    method: 'post'
  })
  @log
  async addMessage(ctx: Koa.Context) {}
}
