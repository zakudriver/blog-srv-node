import * as Koa from 'koa';
import * as Crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
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

/**
 * 路径处理
 *
 * @export
 * @param {string} dir
 * @returns
 */
export function cwdResolve(dir: string) {
  // if (config.get('env') === 'production') {
  //   return dir;
  // }
  return path.resolve(process.cwd() + dir);
}

/**
 * 递归创建路径 (同步)
 *
 * @export
 * @param {string} dir
 * @returns
 */
export function mkdirsSync(dir: string) {
  if (fs.existsSync(dir)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dir))) {
      fs.mkdirSync(dir);
      return true;
    }
  }
}
