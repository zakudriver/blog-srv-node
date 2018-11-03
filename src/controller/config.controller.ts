import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { AdminConfigMod } from '../db/model';
import { trycatch } from '../libs/utils';
import { Permission, Status } from '../constants/enum';

@prefix('/config')
export default class ConfigController {
  @router({
    path: '/admin',
    method: 'get'
  })
  @log
  async getAdminConfig(ctx: Koa.Context) {
    await trycatch(ctx, async () => {
      const results = await AdminConfigMod.find();
      ctx.body = {
        code: Status.ok,
        data: results[0],
        msg: `admin's config get successfully`
      };
    });
  }

  // @router({
  //   path: '/addAdminTest',
  //   method: 'get'
  // })
  // @log
  // async addAdminConfig(ctx: Koa.Context) {
  //   const newAdminConfig = new AdminConfigMod({
  //     primaryColor: '#1da57a',
  //     drawerColor: '#5ee2b9',
  //     title: `Welcome, Zyhua's Admin`,
  //     drawerWidth: 30
  //   });
  //   await newAdminConfig.save();

  //   ctx.body = {
  //     code: Status.ok
  //   };
  // }

  @router({
    path: '/admin',
    method: 'put'
  })
  @permission(Permission.root)
  @auth
  @log
  async UpdateAdminConfig(ctx: Koa.Context) {
    const req = ctx.request.body;

    await trycatch(
      ctx,
      async () => {
        const results = await AdminConfigMod.updateOne({ _id: req._id }, { $set: req });
        if (results) {
          ctx.body = {
            code: Status.ok,
            data: null,
            msg: `admin's config updated successfully`
          };
        }
      },
      `admin's config updated failed`
    );
  }
}
