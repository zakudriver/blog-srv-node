import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Status, Permission } from '../../constants/enum';
import { trycatch } from '../../libs/utils';
import { UserMod } from '../../db/model';
import { USER_LIST } from '../../global';

// 验证用户
export const verifyUser: Koa.Middleware = async (ctx, next) => {
  const uid = ctx.request.uid;

  if (uid) {
    await trycatch(
      ctx,
      async () => {
        if (USER_LIST.length) {
          const user = USER_LIST.find(i => i._id.toString() === uid);

          if (user) {
            ctx.request.user = user;
          } else {
            await findUser(ctx, uid);
          }
        } else {
          await findUser(ctx, uid);
        }
      },
      'user verify failed'
    );
  }
  await next();
};

async function findUser(ctx: Koa.BaseContext, _id: string) {
  const user = await UserMod.findById(_id);
  if (user) {
    ctx.request.user = user;
    USER_LIST.push(user);
  }
}

/**
 * 路由中间件 权限验证
 *
 * @export
 * @param {number} permissionType
 * @returns {Router.IMiddleware}
 */
export function verifyPermission(permissionType: number): Router.IMiddleware {
  return async (ctx, next) => {
    const user = ctx.request.user;

    if (user) {
      const permission = user.permission;
      if (permissionType >= permission || permission === Permission.root) {
        await next();
      } else {
        ctx.body = {
          code: Status.permission,
          data: null,
          msg: 'ERROR Permission denied!'
        };
      }
    } else {
      ctx.body = {
        code: Status.bug,
        data: null,
        msg: 'bug! 请联系开发者'
      };
    }
  };
}
