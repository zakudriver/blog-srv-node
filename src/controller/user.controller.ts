import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { signToken } from '../middleware/auth';
import { UserMod } from '../db/model';
import { cryptPwd, trycatch } from '../libs/utils';
import redis from '../redis';
import config from '../config';

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
      code: 0,
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
            ctx.body = {
              code: 0,
              data: null,
              msg: 'login successful',
              token
            };
            const _id = results._id.toString();
            await redis.setAsync(_id, JSON.stringify({ token, time: new Date().getTime() }));
            await redis.pexpireAsync(_id, jwt.overtime);
          } else {
            ctx.body = {
              code: 1,
              data: null,
              msg: 'password error'
            };
          }
        } else {
          ctx.body = {
            code: 1,
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
      username: 'guest',
      password: cryptPwd('123')
    });

    await trycatch(ctx, async () => {
      const results = await newUser.save();
      ctx.body = {
        code: 0,
        data: results,
        msg: 'register successful'
      };
    });

    // try {
    //   const results = await newUser.save();
    //   ctx.body = {
    //     code: 0,
    //     data: results,
    //     msg: 'register successful'
    //   };
    // } catch (err) {
    //   ctx.body = {
    //     code: 1,
    //     data: null,
    //     msg: err.errmsg
    //   };
    //   errLog(err);
    // }
  }
}
