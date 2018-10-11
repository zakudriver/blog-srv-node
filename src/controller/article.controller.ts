import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { ArticleMod } from '../db/model';
import { IArticle } from '../db/model/article';
import { trycatch } from '../libs/utils';

@prefix('/article')
export default class articleController {
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
        const results = await ArticleMod.findById(req._id);

        ctx.body = {
          code: 0,
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
  @log
  async getArticleList(ctx: Koa.Context) {
    let { index, limit, condition, className } = ctx.query;
    index = +index;
    limit = +limit;
    condition = +condition;

    let find = {};
    if (condition === 1) {
      find = { isFormal: true };
    } else if (condition === 2) {
      find = { isFormal: false };
    }
    if (className) {
      Object.assign(find, { className });
    }

    await trycatch(
      ctx,
      async () => {
        const count = await ArticleMod.countDocuments();
        const results = await ArticleMod.find(find)
          .populate('className', 'name')
          .skip((index - 1) * limit)
          .limit(limit)
          .sort({ updateTime: 1 })
          .exec();

        results.forEach(i => {
          i.content = i.content.substr(0, 300);
        });

        ctx.body = {
          code: 0,
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
  @log
  async addArticle(ctx: Koa.Context) {
    const req = ctx.request.body as {
      title: string;
      content: string;
      classId: string;
      isFormal: boolean;
      time: string;
    };
    const isFormal = req.isFormal;
    const newArticle = new ArticleMod(req);
    await trycatch(
      ctx,
      async () => {
        await newArticle.save();
        ctx.body = {
          code: 0,
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
  @log
  async removeArticle(ctx: Koa.Context) {
    const req = <{ _id: string }>ctx.request.body;
    await trycatch(
      ctx,
      async () => {
        await ArticleMod.findByIdAndRemove(req._id);
        ctx.body = {
          code: 0,
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
  @log
  async updateArticle(ctx: Koa.Context) {
    const req = ctx.request.body as IArticle;

    await trycatch(
      ctx,
      async () => {
        const results = await ArticleMod.findByIdAndUpdate(req._id, req);
        console.log(results);
        ctx.body = {
          code: 0,
          data: null,
          msg: 'article update successfully'
        };
      },
      'article update failed'
    );
  }
}
