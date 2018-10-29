import * as fs from 'fs';
import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { cwdResolve, trycatch } from '../libs/utils';
import config from '../config';
import { fs_stat, fs_unlink } from '../libs/promisify';
import { UploadMod } from '../db/model';
import { Permission, Status } from '../constants/enum';

const dir = cwdResolve(config.get('upload').uploadDir.article);

@prefix('/upload')
export default class UploadController {
  @router({
    path: '',
    method: 'post'
  })
  @auth
  @permission(Permission.root)
  @log
  async uploadFile(ctx: Koa.Context) {
    // console.log(ctx.request.files);
    // const dir = cwdResolve(config.get('upload').uploadDir.article);

    if (!ctx.request.files) {
      return (ctx.body = {
        code: Status.error,
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
            code: Status.error,
            data: results,
            msg: 'upload successful'
          };
        }
      },
      'upload failed'
    );
  }

  @router({
    path: '',
    method: 'delete'
  })
  @auth
  @required(['_id'])
  @permission(Permission.root)
  @log
  async removeUpload(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        // const files = await fs_readdir('dir');

        const target = await UploadMod.findByIdAndRemove(req._id);
        if (target) {
          await fs_unlink(dir + '/' + target.name);

          ctx.body = {
            code: Status.ok,
            data: null,
            msg: 'uploadfile remove successfully'
          };
        } else {
          ctx.body = {
            code: Status.error,
            data: null,
            msg: 'uploadfile remove failed, file not found'
          };
        }
      },
      'uploadfile remove failed'
    );
  }
}
