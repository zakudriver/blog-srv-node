import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Status, Privilege } from '../../constants/enum';
import { trycatch } from '../../libs/utils';
import { UserMod } from '../../db/model';

const USER_LIST: Koa.IUser[] = [];

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
      'privilege verify failed'
    );
  }
  console.log(USER_LIST);
  await next();
};

async function findUser(ctx: Koa.BaseContext, _id: string) {
  const user = await UserMod.findById(_id);
  console.log('findUser');
  if (user) {
    ctx.request.user = user;
    USER_LIST.push(user);
  }
}

/**
 * 路由中间件 权限验证
 *
 * @export
 * @param {number} privilegeType
 * @returns {Router.IMiddleware}
 */
export function verifyPrivilege(privilegeType: number): Router.IMiddleware {
  return async (ctx, next) => {
    const user = ctx.request.user;

    if (user) {
      const privilege = user.privilege;
      if (privilegeType === privilege || privilege === Privilege.root) {
        await next();
      } else {
        ctx.body = {
          code: Status.privilege,
          data: null,
          msg: 'insufficient privileges'
        };
      }
    } else {
      ctx.body = {
        code: Status.bug,
        data: null,
        msg: 'bug!'
      };
    }
  };
}
