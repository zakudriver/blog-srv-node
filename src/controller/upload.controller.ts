import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';

@prefix('/upload')
export default class UploadController {
  @router({
    path: '',
    method: 'post'
  })
  @auth
  @log
  async uploadFile(ctx: Koa.Context) {
    console.log(ctx.request.files);
  }
}
