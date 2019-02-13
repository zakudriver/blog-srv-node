import * as Koa from 'koa';
import { prefix, router, log, required, auth, permission } from '../middleware/router/decorators';
import { signToken } from '../middleware/auth';
import { UserMod } from '../db/model';
import { cryptPwd, trycatch } from '../libs/utils';
import redis from '../redis';
import config from '../config';
import { Permission, Status } from '../constants/enum';

const jwt = config.get('jwt');

@prefix('/user')
export default class UserController {
  @router({
    path: '/auth',
    method: 'post'
  })
  @auth
  @log
  async auth(ctx: Koa.Context) {
    ctx.body = {
      code: Status.ok,
      data: null,
      msg: 'verify,pass'
    };
  }

  @router({
    path: '/login',
    method: 'post'
  })
  @required(['username', 'password'])
  @log
  async logIn(ctx: Koa.Context) {
    const req = ctx.request.body as { username: string; password: string };
    await trycatch(
      ctx,
      async () => {
        const result = await UserMod.findOne({
          username: req.username
        });
        if (result) {
          if (cryptPwd(req.password) === result.password) {
            const token = signToken(result._id);
            delete result.password;
            ctx.body = {
              code: Status.ok,
              data: result,
              msg: 'login successful',
              token
            };
            // token存redis
            const _id = result._id.toString();
            await redis.setAsync(_id, JSON.stringify({ token, time: new Date().getTime() }));
            await redis.pexpireAsync(_id, jwt.overtime);
          } else {
            ctx.body = {
              code: Status.error,
              data: null,
              msg: 'password error'
            };
          }
        } else {
          ctx.body = {
            code: Status.error,
            data: null,
            msg: 'the user name does not exist'
          };
        }
      },
      'login failed'
    );
  }

  // @router({
  //   path: '/register',
  //   method: 'get'
  // })
  // @log
  // async signIn(ctx: Koa.Context) {
  //   const newUser = new UserMod({
  //     username: 'guest',
  //     password: cryptPwd('guest')
  //   });

  //   await trycatch(
  //     ctx,
  //     async () => {
  //       const results = await newUser.save();
  //       ctx.body = {
  //         code: Status.ok,
  //         data: results,
  //         msg: 'register successful'
  //       };
  //     },
  //     'register failed'
  //   );
  // }

  @router({
    path: '/',
    method: 'put'
  })
  @auth
  @permission(Permission.root)
  @log
  async updateUser(ctx: Koa.Context) {
    const req = ctx.request.body;
    const uid = ctx.request.uid;

    // if (req.oldPassword && req.newPassword) {
    //   await trycatch(
    //     ctx,
    //     async () => {
    //       const user = await UserMod.findById(uid);
    //       if (user) {
    //         console.log(cryptPwd(req.oldPassword));
    //         console.log(user!.password);

    //         if (cryptPwd(req.oldPassword) === user!.password) {
    //           req.password = cryptPwd(req.newPassword);
    //         } else {
    //           return (ctx.body = {
    //             code: Status.error,
    //             data: null,
    //             msg: 'oldPassword error'
    //           });
    //         }
    //       }
    //     },
    //     'password update failed'
    //   );
    // }

    await trycatch(
      ctx,
      async () => {
        if (req.oldPassword && req.newPassword) {
          const user = await UserMod.findById(uid);
          if (user) {
            if (cryptPwd(req.oldPassword) === user!.password) {
              req.password = cryptPwd(req.newPassword);
            } else {
              return (ctx.body = {
                code: Status.error,
                data: null,
                msg: 'oldPassword error'
              });
            }
          }
        }

        await UserMod.findByIdAndUpdate(uid, { $set: req });

        delete req.oldPassword;
        delete req.newPassword;
        ctx.body = {
          code: Status.ok,
          data: req,
          msg: 'user modify successful'
        };
      },
      'user modify failed'
    );
  }

  @router({
    path: '/info',
    method: 'get'
  })
  @auth
  @log
  async getUserInfo(ctx: Koa.Context) {
    const uid = ctx.request.uid;

    await trycatch(
      ctx,
      async () => {
        const results = await UserMod.findById(uid, { username: 1, avatar: 1, permission: 1 });
        if (results) {
          ctx.body = {
            code: Status.ok,
            data: results,
            msg: 'get user info successful'
          };
        }
      },
      'get user info failed'
    );
  }

  @router({
    path: '/list',
    method: 'get'
  })
  @log
  async getUserList(ctx: Koa.Context) {
    await trycatch(
      ctx,
      async () => {
        const count = await UserMod.countDocuments();
        const results = await UserMod.find({}, { username: 1, avatar: 1, permission: 1 }).sort({ permission: 1 });
        if (results) {
          ctx.body = {
            code: Status.ok,
            data: {
              rows: results,
              count
            },
            msg: 'get user list successful'
          };
        }
      },
      'get user list failed'
    );
  }

  @router({
    path: '/',
    method: 'delete'
  })
  @log
  async removeUser(ctx: Koa.Context) {
    const req = <{ _id: string }>ctx.request.body;

    await trycatch(
      ctx,
      async () => {
        await UserMod.findByIdAndRemove(req._id);
        ctx.body = {
          code: Status.ok,
          data: null,
          msg: 'user deleted successfully'
        };
      },
      'user deleted failed'
    );
  }
}
