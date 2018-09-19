import * as Koa from 'koa';
import { prefix, router, log } from '../middleware/router/decorators';

@prefix('/user')
export default class userController {
  @router({
    path: '/login',
    method: 'post'
  })
  @log
  async logIn(ctx: Koa.Context) {
    ctx.body = 'test';
  }

  @router({
    path: '/register',
    method: 'post'
  })
  @log
  async signIn(ctx: Koa.Context) {
    console.log(ctx.request);
  }
}
