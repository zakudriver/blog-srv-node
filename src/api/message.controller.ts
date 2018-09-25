import * as Koa from 'koa';
import { prefix, router, log, required,auth } from '../middleware/router/decorators';

@prefix('/message')
export default class MessageController {
  @router({
    path: '',
    method: 'get',
  })
  @auth
  @log
  async getMessage(ctx: Koa.Context) {
    console.log('getMessage')
    ctx.body = { test: 'tst' };
  }

  @router({
    path: '',
    method: 'post'
  })
  @log
  async addMessage(ctx: Koa.Context) {}
}
