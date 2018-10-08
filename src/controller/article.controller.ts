import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { ArticleMod } from '../db/model';
import { IArticle } from '../db/model/article';
import { ClassificationMod } from '../db/model';
import { trycatch } from '../libs/utils';

interface IArticleResponse extends IArticle {
  className: string;
}

@prefix('/article')
export default class articleController {
  @router({
    path: '',
    method: 'get'
  })
  @log
  async getArticle(ctx: Koa.Context) {}

  @router({
    path: '/listpro',
    method: 'get'
  })
  @auth
  @required(['index', 'limit'])
  @log
  async getArticleList(ctx: Koa.Context) {
    let { index, limit } = ctx.query;
    index = +index;
    limit = +limit;

    await trycatch(
      ctx,
      async () => {
        const count = await ArticleMod.countDocuments();
        const results = await ArticleMod.find({})
          .populate('className', 'name')
          .skip((index - 1) * limit)
          .limit(limit)
          .sort({ updateTime: 1 })
          .exec();

        ctx.body = {
          code: 0,
          data: {
            rows: results,
            count
          },
          msg: 'article,hold well'
        };
      },
      'article get failed'
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
    const req = ctx.request.body as { title: string; content: string; classId: string; isFormal: boolean; time: string };
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
    // const newArticle=new ArticleMod()
  }

  @router({
    path: '/save',
    method: 'post'
  })
  @auth
  @log
  async saveArticle(ctx: Koa.Context) {
    const req = ctx.request.body;

    ctx.body = {
      code: 0,
      data: req,
      msg: 'article save successfully'
    };
    // const newArticle=new ArticleMod()
  }

  @router({
    path: '',
    method: 'delete'
  })
  @auth
  @required(['_id'])
  @log
  async removeArticle(ctx: Koa.Context) {}

  @router({
    path: '',
    method: 'put'
  })
  @auth
  @required(['_id'])
  @log
  async modifyArticle(ctx: Koa.Context) {}
}
