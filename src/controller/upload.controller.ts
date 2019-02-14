import * as fs from 'fs';
import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { cwdResolve, trycatch, mkdirsSync } from '../libs/utils';
import config from '../config';
import { fs_stat, fs_unlink } from '../libs/promisify';
import { UploadMod } from '../db/model';
import { Permission, Status } from '../constants/enum';

const env = config.get('env');
// 文章（文件）上传文件路径
const articleDir = config.get('upload').uploadDir.article;
const articleUploadDir = cwdResolve(articleDir);
// 用户（头像）上传路径
const profileDir = config.get('upload').uploadDir.profile;
const profileUploadDir = cwdResolve(profileDir);
// 上传后返回所在域名
const uploadHost = config.get('upload').host[env];

@prefix('/upload')
export default class UploadController {
  @router({
    path: '/article',
    method: 'post'
  })
  @auth
  @permission(Permission.root)
  @log
  async articleFileUpload(ctx: Koa.Context) {
    if (!ctx.request.files) {
      return (ctx.body = {
        code: Status.error,
        data: null,
        msg: 'article file upload failed'
      });
    }

    await trycatch(
      ctx,
      async () => {
        const stat = await fs_stat(articleUploadDir);
        if (!stat.isDirectory()) {
          mkdirsSync(articleUploadDir);
        }

        const file = ctx.request.files!.uploadFile;
        const reader = fs.createReadStream(file.path);
        const ext = file.name.split('.').pop();
        const uploadName = `article_${new Date().getTime()}.${ext}`;
        const writer = fs.createWriteStream(`${articleUploadDir}/${uploadName}`);

        reader.pipe(writer);

        const uploadUrl = `${uploadHost}/article/${uploadName}`;
        const newUpload = new UploadMod({ name: uploadName, url: uploadUrl });
        const results = await newUpload.save();

        ctx.body = {
          code: Status.ok,
          data: results,
          msg: 'article file upload successful'
        };
      },
      'upload failed'
    );
  }

  @router({
    path: '',
    method: 'post'
  })
  @auth
  @permission(Permission.root)
  @log
  async profileUpload(ctx: Koa.Context) {
    if (!ctx.request.files) {
      return (ctx.body = {
        code: Status.error,
        data: null,
        msg: 'profile file upload failed'
      });
    }

    await trycatch(
      ctx,
      async () => {
        const stat = await fs_stat(profileUploadDir);
        if (!stat.isDirectory()) {
          mkdirsSync(articleUploadDir);
        }

        const file = ctx.request.files!.uploadFile;
        const reader = fs.createReadStream(file.path);
        const ext = file.name.split('.').pop();
        const uploadName = `image_${new Date().getTime()}.${ext}`;
        const writer = fs.createWriteStream(`${profileUploadDir}/${uploadName}`);

        reader.pipe(writer);

        const uploadUrl = `${uploadHost}/profile/${uploadName}`;

        ctx.body = {
          code: Status.ok,
          data: uploadUrl,
          msg: 'profile file upload successful'
        };
      },
      'profile file upload failed'
    );
  }

  @router({
    path: '/article',
    method: 'delete'
  })
  @auth
  @required(['_id'])
  @permission(Permission.root)
  @log
  async removeArticleUpload(ctx: Koa.Context) {
    const req = ctx.request.body as { _id: string };

    await trycatch(
      ctx,
      async () => {
        // const files = await fs_readdir('dir');

        const target = await UploadMod.findByIdAndRemove(req._id);
        if (target) {
          try {
            await fs_unlink(articleUploadDir + '/' + target.name);
          } catch (err) {
            ctx.body = {
              code: Status.ok,
              data: null,
              msg: 'uploadfile not found, remove db successfully'
            };
          }

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
