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
        const results = await UserMod.findOne({
          username: req.username
        });
        if (results) {
          if (cryptPwd(req.password) === results.password) {
            const token = signToken(results._id);
            delete results.password
            ctx.body = {
              code: Status.ok,
              data: results,
              msg: 'login successful',
              token
            };
            // token存redis
            const _id = results._id.toString();
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

  @router({
    path: '/register',
    method: 'get'
  })
  @log
  async signIn(ctx: Koa.Context) {
    const newUser = new UserMod({
      username: 'zyhua1122',
      password: cryptPwd('zyhua248655'),
      permission: 0
    });

    await trycatch(ctx, async () => {
      const results = await newUser.save();
      ctx.body = {
        code: Status.ok,
        data: results,
        msg: 'register successful'
      };
    });
  }

  @router({
    path: '/',
    method: 'put'
  })
  @auth
  @permission(Permission.root)
  @log
  async updateUser(ctx: Koa.Context) {
    const req = ctx.request.body;

    await trycatch(ctx, async () => {
      await UserMod.findByIdAndUpdate(req._id, { $set: req });
      ctx.body = {
        code: Status.ok,
        data: null,
        msg: 'user update successful'
      };
    });
  }
}
