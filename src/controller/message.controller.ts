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
  @required(['index', 'limit'])
  @auth
  @log
  async getMessage(ctx: Koa.Context) {
    let { index, limit } = ctx.query;
    index = +index;
    limit = +limit;

    await trycatch(
      ctx,
      async () => {
        const count = await MessageMod.countDocuments();
        const results = await MessageMod.find({})
          .skip((index - 1) * limit)
          .limit(limit)
          .sort({ time: -1 })
          .exec();

        ctx.body = {
          code: 0,
          data: {
            rows: results,
            count
          },
          msg: 'message,hold well'
        };
      },
      'message get failed'
    );
  }

  @router({
    path: '',
    method: 'post'
  })
  @log
  async addMessage(ctx: Koa.Context) {
    const req = ctx.request.body;

    const newMessage = new MessageMod(req);
    await trycatch(
      ctx,
      async () => {
        await newMessage.save();
        ctx.body = {
          code: 0,
          data: null,
          msg: 'message sent successfully'
        };
      },
      'message sent failed'
    );
  }

  @router({
    path: '',
    method: 'delete'
  })
  @required(['_id'])
  @auth
  @log
  async removeMessage(ctx: Koa.Context) {
    const req = <{ _id: string }>ctx.request.body;
    await trycatch(
      ctx,
      async () => {
        await MessageMod.findByIdAndRemove(req._id);
        ctx.body = {
          code: 0,
          data: null,
          msg: 'message deleted successfully'
        };
      },
      'message deleted failed'
    );
  }
}
