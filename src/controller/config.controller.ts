import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { AdminConfigMod } from '../db/model';
import { FrontConfigMod } from '../db/model';
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
      const results = await AdminConfigMod.findOne();
      ctx.body = {
        code: Status.ok,
        data: results,
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
        const results = await AdminConfigMod.updateOne({}, { $set: req });
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

  /*
  up: admin ======= down:blog
  */

  @router({
    path: '/front',
    method: 'get'
  })
  @log
  async getFrontConfig(ctx: Koa.Context) {
    await trycatch(ctx, async () => {
      const results = await FrontConfigMod.findOne(
        {},
        { avatar: 1, name: 1, profile: 1, description: 1, cover: 1, defaultThumb: 1 }
      );
      ctx.body = {
        code: Status.ok,
        data: results,
        msg: `front's config get successfully`
      };
    });
  }

  // @router({
  //   path: '/addFrontTest',
  //   method: 'get'
  // })
  // @log
  // async addFrontConfig(ctx: Koa.Context) {
  //   const newFrontConfig = new FrontConfigMod({
  //     avatar: 'url',
  //     name: 'Zyhua',
  //     profile: 'Coder',
  //     description: 'test',
  //     cover: {
  //       home: '1',
  //       blog: '2'
  //     },
  //     defaultThumb: ['1', '2']
  //   });
  //   await newFrontConfig.save();

  //   ctx.body = {
  //     code: Status.ok
  //   };
  // }

  @router({
    path: '/front',
    method: 'put'
  })
  @permission(Permission.root)
  @auth
  @log
  async UpdateFrontConfig(ctx: Koa.Context) {
    const req = ctx.request.body;

    await trycatch(
      ctx,
      async () => {
        const results = await FrontConfigMod.updateOne({}, { $set: req });
        if (results) {
          ctx.body = {
            code: Status.ok,
            data: results,
            msg: `front's config updated successfully`
          };
        }
      },
      `front's config updated failed`
    );
  }
}
