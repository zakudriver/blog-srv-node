import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { ArticleMod } from '../db/model';
import { trycatch } from '../libs/utils';
import { Permission, Status } from '../constants/enum';
import { IArticleMessage } from 'src/db/model/article';

@prefix('/article')
export default class ArticleController {
  @router({
    path: '',
    method: 'get'
  })
  @required(['_id'])
  @log
  async getArticle(ctx: Koa.Context) {
    const req = ctx.query;
    await trycatch(
      ctx,
      async () => {
        await ArticleMod.findByIdAndUpdate(req._id, { $inc: { read: 1 } });
        const results = await ArticleMod.findById(req._id)
          .populate('uploads', ['url', 'name'])
          .populate('Category', 'name');

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'article,hold well '
        };
      },
      'article get failed'
    );
  }

  @router({
    path: '/listpro',
    method: 'get'
  })
  @auth
  @required(['index', 'limit'])
  @permission(Permission.root)
  @log
  async getArticleListPro(ctx: Koa.Context) {
    let { index, limit, condition, category } = ctx.query;
    index = +index;
    limit = +limit;
    condition = +condition;

    let find: { isFormal?: boolean; category?: string } = {};
    if (condition === 1) {
      find.isFormal = true;
    } else if (condition === 2) {
      find.isFormal = false;
    }
    if (category) {
      find.category = category;
    }

    await trycatch(
      ctx,
      async () => {
        const count = await ArticleMod.countDocuments();
        const results = await ArticleMod.find(find)
          .populate('category', 'name')
          .skip((index - 1) * limit)
          .limit(limit)
          .sort({ updateTime: 1 })
          .exec();

        results.forEach(i => {
          i.content = i.content.substr(0, 300);
        });

        ctx.body = {
          code: Status.ok,
          data: {
            rows: results,
            count
          },
          msg: 'articles,hold well'
        };
      },
      'articles get failed'
    );
  }

  @router({
    path: '/list',
    method: 'get'
  })
  @required(['index', 'limit'])
  @log
  async getArticleList(ctx: Koa.Context) {
    let { index, limit, category } = ctx.query;
    index = +index;
    limit = +limit;

    let find: { isFormal?: boolean; category?: string } = { isFormal: true };
    if (category) {
      find.category = category;
    }

    await trycatch(
      ctx,
      async () => {
        // const count = await ArticleMod.countDocuments();
        const results = await ArticleMod.find(find)
          .populate('category', 'name')
          .skip((index - 1) * limit)
          .limit(limit)
          .sort({ updateTime: 1 })
          .exec();

        results.forEach(i => {
          i.content = i.content.substr(0, 300);
        });

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'articles,hold well'
        };
      },
      'articles get failed'
    );
  }

  @router({
    path: '/search',
    method: 'get'
  })
  @log
  async searchArticle(ctx: Koa.Context) {}

  @router({
    path: '',
    method: 'post'
  })
  @auth
  @permission(Permission.root)
  @log
  async addArticle(ctx: Koa.Context) {
    const req = ctx.request.body;

    const isFormal = req.isFormal;
    const newArticle = new ArticleMod(req);
    await trycatch(
      ctx,
      async () => {
        await newArticle.save();
        ctx.body = {
          code: Status.ok,
          data: req,
          msg: `article ${isFormal ? 'pulish' : 'save'} successfully`
        };
      },
      `article ${isFormal ? 'pulish' : 'save'} failed`
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
  async removeArticle(ctx: Koa.Context) {
    const req = <{ _id: string }>ctx.request.body;
    await trycatch(
      ctx,
      async () => {
        await ArticleMod.findByIdAndRemove(req._id);
        ctx.body = {
          code: Status.ok,
          data: null,
          msg: 'article deleted successfully'
        };
      },
      'article deleted failed'
    );
  }

  @router({
    path: '',
    method: 'put'
  })
  @auth
  @required(['_id'])
  @permission(Permission.root)
  @log
  async updateArticle(ctx: Koa.Context) {
    const req = ctx.request.body;

    await trycatch(
      ctx,
      async () => {
        await ArticleMod.findByIdAndUpdate(req._id, { $set: req });
        ctx.body = {
          code: 0,
          data: null,
          msg: 'article update successfully'
        };
      },
      'article update failed'
    );
  }

  @router({
    path: '/message',
    method: 'post'
  })
  @required(['_id', 'name', 'email', 'text'])
  @log
  async sendReply(ctx: Koa.Context) {
    const req = ctx.request.body;

    await trycatch(
      ctx,
      async () => {
        await ArticleMod.findByIdAndUpdate(req._id, {
          $push: {
            message: req
          }
        });

        ctx.body = {
          code: 0,
          data: null,
          msg: 'message send successfully'
        };
      },
      'message send failed'
    );
  }
}
