import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { CategoriesMod } from '../db/model';
import { ICategories } from '../db/model/categories';
import { trycatch } from '../libs/utils';
import { Permission, Status } from '../constants/enum';

@prefix('/categories')
export default class CategoriesController {
  @router({
    path: '',
    method: 'get'
  })
  @log
  async getCategories(ctx: Koa.Context) {
    await trycatch(ctx, async () => {
      const results = await CategoriesMod.find({}).sort({ order: 1 });
      ctx.body = {
        code: Status.ok,
        data: results,
        msg: 'categories get successfully'
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
  async addCategories(ctx: Koa.Context) {
    const req = ctx.request.body as { name: string; uid: string };
    req.uid = ctx.request.uid;

    const newCategories = new CategoriesMod(req);
    await trycatch(
      ctx,
      async () => {
        await newCategories.save();
        const results = await CategoriesMod.find({ uid: ctx.request.uid }).sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'categories add successfully'
        };
      },
      'categories add failed'
    );
  }

  @router({
    path: '/',
    method: 'put'
  })
  @auth
  @permission(Permission.root)
  @log
  async updateCategories(ctx: Koa.Context) {
    const req = ctx.request.body as ICategories[] | ICategories;

    await trycatch(
      ctx,
      async () => {
        let results;
        if (Array.isArray(req)) {
          const updateArr: any[] = req.map(i => CategoriesMod.findByIdAndUpdate(i._id, { $set: { order: i.order } }));
          results = await Promise.all(updateArr);
        } else {
          await CategoriesMod.findByIdAndUpdate(req._id, { $set: { name: req.name } });
          results = await CategoriesMod.find().sort({ order: 1 });
        }
        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'categories update successfully'
        };
      },
      'categories update failed'
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
  async removeCategories(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        await CategoriesMod.findByIdAndRemove(req._id);
        const results = await CategoriesMod.find().sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'categories remove successfully'
        };
      },
      'categories remove failed'
    );
  }
}
