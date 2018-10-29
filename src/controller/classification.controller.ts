import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { ClassificationMod } from '../db/model';
import { IClassification } from '../db/model/classification';
import { trycatch } from '../libs/utils';
import { Permission, Status } from '../constants/enum';

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
      const results = await ClassificationMod.find({ uid: ctx.request.uid }).sort({ order: 1 });
      ctx.body = {
        code: Status.ok,
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
  @permission(Permission.root)
  @log
  async addClassification(ctx: Koa.Context) {
    const req = ctx.request.body as { name: string; uid: string };
    req.uid = ctx.request.uid;

    const newClassification = new ClassificationMod(req);
    await trycatch(
      ctx,
      async () => {
        await newClassification.save();
        const results = await ClassificationMod.find({ uid: ctx.request.uid }).sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
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
  @permission(Permission.root)
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
          code: Status.ok,
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
  @permission(Permission.root)
  @log
  async removeClassification(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        await ClassificationMod.findByIdAndRemove(req._id);
        const results = await ClassificationMod.find().sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'classification remove successfully'
        };
      },
      'classification remove failed'
    );
  }
}
