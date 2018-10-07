import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { ArticleMod } from '../db/model';

@prefix('/article')
export default class articleController {
  @router({
    path: '',
    method: 'get'
  })
  @log
  async getArticle(ctx: Koa.Context) {}

  @router({
    path: '/list',
    method: 'get'
  })
  @auth
  @required(['index', 'limit', 'isFormal'])
  @log
  async getArticleList(ctx: Koa.Context) {}

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
    const req = ctx.request.body;

    ctx.body = {
      code: 0,
      data: req,
      msg: 'article pulish successfully'
    };
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
