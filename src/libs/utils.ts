import * as Koa from 'koa';
import * as Crypto from 'crypto';
import * as path from 'path';
import config from '../config';
import { errLog } from '../libs/log';
import { Status } from '../constants/enum';

/**
 * 密码MD5加密
 * @param password
 * @param salt
 */
export function cryptPwd(password: string, salt = config.get('user').salt) {
  const saltPassword = password + ':' + salt;
  const md5 = Crypto.createHash('md5');
  return md5.update(saltPassword).digest('hex');
}

/**
 * await错误处理
 * try{}catch(err){}
 * @export
 * @param {Koa.Context} ctx
 * @param {() => void} func
 * @param {string} [errMsg]
 */
export async function trycatch(ctx: Koa.Context, func: () => void, errMsg?: string) {
  try {
    await func();
  } catch (err) {
    ctx.body = {
      code: Status.BDerror,
      data: null,
      msg: errMsg || err.errmsg
    };
    errLog(err);
  }
}

export function cwdResolve(dir: string) {
  return path.resolve(process.cwd() + dir);
}
