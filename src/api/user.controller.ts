import * as Koa from 'koa';
import * as Crypto from 'crypto';
import { prefix, router, log } from '../middleware/router/decorators';
import { signToken } from '../middleware/token';
import { UserMod } from '../db/model';
import { errLog } from '../libs/log';
import config from '../config';

@prefix('/user')
export default class userController {
  @router({
    path: '/login',
    method: 'get',
    unless: true
  })
  @log
  async logIn(ctx: Koa.Context) {
    console.log(ctx.body);
    const req = ctx.request;
    const results = await UserMod.findOne(req);
    ctx.body = {
      code: 0
    };
  }

  @router({
    path: '/register',
    method: 'get',
    unless: true
  })
  @log
  async signIn(ctx: Koa.Context) {
    const newUser = new UserMod({
      
    });

    try {
      const results = await newUser.save();
      ctx.body = {
        code: 0,
        data: results,
        msg: '注册账号成功'
      };
    } catch (err) {
      ctx.body = {
        code: 0,
        data: null,
        msg: err.errmsg
      };
      errLog(err);
    }
  }
}

function cryptPwd(password: string, salt = config.get('user').salt) {
  const saltPassword = password + ':' + salt;
  const md5 = Crypto.createHash('md5');
  return md5.update(saltPassword).digest('hex');
}
