import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { ClassificationMod } from '../db/model';
import { IClassification } from '@src/db/model/classification';
import { trycatch } from '../libs/utils';

@prefix('/classification')
export default class ClassificationController {
  @router({
    path: '',
    method: 'get'
  })
  @auth
  @log
  async getClassification(ctx: Koa.Context) {
    await trycatch(ctx, async () => {
      const results = await ClassificationMod.find().sort({ order: 1 });
      ctx.body = {
        code: 0,
        data: results,
        msg: 'classification get successfully'
      };
    });
  }

  @router({
    path: '',
    method: 'post'
  })
  @auth
  @required(['name'])
  @log
  async addClassification(ctx: Koa.Context) {
    const req = ctx.request.body as { name: string };
    const newClassification = new ClassificationMod(req);
    await trycatch(
      ctx,
      async () => {
        await newClassification.save();
        const results = await ClassificationMod.find().sort({ order: 1 });

        ctx.body = {
          code: 0,
          data: results,
          msg: 'classification add successfully'
        };
      },
      'classification add failed'
    );
  }

  @router({
    path: '/',
    method: 'put'
  })
  @auth
  @log
  async updateClassification(ctx: Koa.Context) {
    const req = ctx.request.body as IClassification[] | IClassification;

    await trycatch(
      ctx,
      async () => {
        let results;
        if (Array.isArray(req)) {
          const updateArr: any[] = req.map(i => ClassificationMod.findByIdAndUpdate(i._id, { $set: { order: i.order } }));
          results = await Promise.all(updateArr);
        } else {
          await ClassificationMod.findByIdAndUpdate(req._id, { $set: { name: req.name } });
          results = await ClassificationMod.find().sort({ order: 1 });
        }
        ctx.body = {
          code: 0,
          data: results,
          msg: 'classification update successfully'
        };
      },
      'classification update failed'
    );
  }

  @router({
    path: '',
    method: 'delete'
  })
  @auth
  @required(['_id'])
  @log
  async removeClassification(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        await ClassificationMod.findByIdAndRemove(req._id);
        const results = await ClassificationMod.find().sort({ order: 1 });

        ctx.body = {
          code: 0,
          data: results,
          msg: 'classification remove successfully'
        };
      },
      'classification remove failed'
    );
  }
}
