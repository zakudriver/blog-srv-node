import * as fs from 'fs';
import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { cwdDir } from '../libs/utils';
import config from '../config'

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
    console.log(config.get('upload').maxUploadSize)

    
    // if (ctx.request.files) {
    //   const file = ctx.request.files.file;
    //   const reader = fs.createReadStream(file.path);
    //   const ext = file.name.split('.').pop();
    //   const upStream = fs.createWriteStream(`upload/${Math.random().toString()}.${ext}`);
    //   reader.pipe(upStream);
    // }
  }
}
