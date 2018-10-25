import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { MessageMod } from '../db/model';
import { trycatch } from '../libs/utils';
import * as http from 'http';

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
        const results = await MessageMod.find({ uid: ctx.request.uid })
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
    path: '/get',
    method: 'get'
  })
  @log
  async addMessage(ctx: Koa.Context) {
    // const req = ctx.request.body as { email: string; text: string; uid: string };
    // req.uid = ctx.request.uid;
    const options = {
      hostname: '116.62.201.8',
      port: 5002,
      path: '/webapi/Home/NewsList',
      method: 'GET'
    };

    function Pro(): Promise<string> {
      return new Promise(resolve => {
        const req = http.request(options, res => {
          let resp = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            console.log(`响应主体: ${chunk}`);
            resp += chunk;
          });
          res.on('end', () => {
            resolve(resp);
          });
        });

        req.on('error', (err: any) => {
          console.log(err);
        });

        req.end(() => console.log('over'));
      });
    }

    const res = await Pro();
    ctx.body = JSON.parse(res);

    // const newMessage = new MessageMod({ email: '11111', text: '2222', uid: ctx.request.uid });
    // await trycatch(
    //   ctx,
    //   async () => {
    //     await newMessage.save();
    //     ctx.body = {
    //       code: 0,
    //       data: null,
    //       msg: 'message sent successfully'
    //     };
    //   },
    //   'message sent failed'
    // );
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
        await MessageMod.findByIdAndDelete(req._id);
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
