import * as Koa from 'koa';
import { prefix, router, log, required } from '../middleware/router/decorators';

@prefix('/message')
export default class MessageController {
  @router({
    path: '',
    method: 'get'
  })
  @log
  async getMessage(ctx: Koa.Context) {
    ctx.body = 'test';
  }

  @router({
    path: '',
    method: 'post'
  })
  @log
  async addMessage(ctx: Koa.Context) {}
}
