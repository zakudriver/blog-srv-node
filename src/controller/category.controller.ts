import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { CategoryMod } from '../db/model';
import { ICategory } from '../db/model/category';
import { trycatch } from '../libs/utils';
import { Permission, Status } from '../constants/enum';

@prefix('/category')
export default class CategoryController {
  @router({
    path: '',
    method: 'get'
  })
  @log
  async getCategory(ctx: Koa.Context) {
    await trycatch(ctx, async () => {
      const results = await CategoryMod.find({}, { _id: 1, name: 1 }).sort({ order: 1 });
      ctx.body = {
        code: Status.ok,
        data: results,
        msg: 'category get successfully'
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
  async addCategory(ctx: Koa.Context) {
    const req = ctx.request.body as { name: string; uid: string };
    req.uid = ctx.request.uid;

    const newCategory = new CategoryMod(req);
    await trycatch(
      ctx,
      async () => {
        await newCategory.save();
        const results = await CategoryMod.find({ uid: ctx.request.uid }).sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'category add successfully'
        };
      },
      'category add failed'
    );
  }

  @router({
    path: '/',
    method: 'put'
  })
  @auth
  @permission(Permission.root)
  @log
  async updateCategory(ctx: Koa.Context) {
    const req = ctx.request.body as ICategory[] | ICategory;

    await trycatch(
      ctx,
      async () => {
        let results;
        if (Array.isArray(req)) {
          const updateArr: any[] = req.map(i => CategoryMod.findByIdAndUpdate(i._id, { $set: { order: i.order } }));
          results = await Promise.all(updateArr);
        } else {
          await CategoryMod.findByIdAndUpdate(req._id, { $set: { name: req.name } });
          results = await CategoryMod.find().sort({ order: 1 });
        }
        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'category update successfully'
        };
      },
      'category update failed'
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
  async removeCategory(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        await CategoryMod.findByIdAndRemove(req._id);
        const results = await CategoryMod.find().sort({ order: 1 });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'category remove successfully'
        };
      },
      'category remove failed'
    );
  }
}
