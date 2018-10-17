import * as fs from 'fs';
import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { cwdResolve, trycatch } from '../libs/utils';
import config from '../config';
import { fs_stat } from '../libs/promisify';
import { UploadMod } from '../db/model';

@prefix('/upload')
export default class UploadController {
  @router({
    path: '',
    method: 'post'
  })
  @auth
  @log
  async uploadFile(ctx: Koa.Context) {
    // console.log(ctx.request.files);
    const dir = cwdResolve(config.get('upload').uploadDir.article);

    if (!ctx.request.files) {
      return (ctx.body = {
        code: 1,
        data: null,
        msg: 'upload failed'
      });
    }

    await trycatch(
      ctx,
      async () => {
        const statResult = await fs_stat(dir);

        if (statResult.isDirectory()) {
          const file = ctx.request.files!.uploadFile;
          const reader = fs.createReadStream(file.path);
          const ext = file.name.split('.').pop();
          const uploadName = `article_${new Date().getTime()}.${ext}`;
          const writer = fs.createWriteStream(`${dir}/${uploadName}`);

          reader.pipe(writer);

          const uploadUrl = `http://127.0.0.1:8999/upload/article/${uploadName}`;
          const newUpload = new UploadMod({ name: uploadName, url: uploadUrl });
          const results = await newUpload.save();

          ctx.body = {
            code: 0,
            data: results,
            msg: 'upload successful'
          };
        }
      },
      'upload failed'
    );
  }
}
