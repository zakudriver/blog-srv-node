import * as Koa from 'koa'
import { prefix, router } from '../middleware/router/decorators'

@prefix('/message')
export default class MessageController {
  @router({
    path: '',
    method: 'get'
  })
  async getMessage(ctx: Koa.Context) {
    ctx.body = 'test'
  }
}
