import * as Koa from 'koa';
import { prefix, router, log, required } from '../middleware/router/decorators';
import { signToken } from '../middleware/auth';
import { UserMod } from '../db/model';
import { cryptPwd, trycatch } from '../libs/utils';
import redis from '../middleware/redis';
import config from '../config';

const jwt = config.get('jwt');

@prefix('/user')
export default class userController {
  @router({
    path: '/login',
    method: 'post',
    unless: true
  })
  @required(['username', 'password'])
  @log
  async logIn(ctx: Koa.Context) {
    const req = ctx.request.body as { username: string; password: string };

    await trycatch(ctx, async () => {
      const results = await UserMod.findOne({
        username: req.username
      });
      if (results) {
        if (cryptPwd(req.password) === results.password) {
          const token = signToken(results._id);
          ctx.body = {
            code: 0,
            data: null,
            msg: '登录成功',
            token
          };
          const _id = results._id.toString();
          await redis.set(_id, token, () => {
            console.log('set ok');
          });
          redis.expire(_id, jwt.overtime / 1000, () => {
            console.log('expire ok');
          });
        } else {
          ctx.body = {
            code: 1,
            data: null,
            msg: '密码错误'
          };
        }
      } else {
        ctx.body = {
          code: 1,
          data: null,
          msg: '账号不存在'
        };
      }
    });
  }

  @router({
    path: '/register',
    method: 'get',
    unless: true
  })
  @log
  async signIn(ctx: Koa.Context) {
    const newUser = new UserMod({
      // username: '',
      // password: ''
    });

    await trycatch(ctx, async () => {
      const results = await newUser.save();
      ctx.body = {
        code: 0,
        data: results,
        msg: '注册账号成功'
      };
    });

    // try {
    //   const results = await newUser.save();
    //   ctx.body = {
    //     code: 0,
    //     data: results,
    //     msg: '注册账号成功'
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
