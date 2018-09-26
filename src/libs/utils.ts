import * as Koa from 'koa';
import * as Crypto from 'crypto';
import config from '../config';
import { errLog } from '../libs/log';

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
      code: 2,
      data: null,
      msg: errMsg || err.errmsg
    };
    errLog(err);
  }
}
