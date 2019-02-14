import * as Jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { cwdResolve } from './utils';
import config from '../config';

/**
 *
 *确认是否为Array,返回Array
 * @export
 * @param {*} params
 * @returns {any[]}
 */
export const isToArray = (params: any) => (Array.isArray(params) ? params : [params]);

/**
 * 解析token获取uid
 *
 * @export
 * @param {string} tokenStr
 * @returns
 */
export function resolveToken(authorization: string): string {
  const clientTokenStr = authorization.split(' ')[1] || '';
  if (clientTokenStr) {
    const clientToken: any = Jwt.decode(clientTokenStr, { complete: true }) || { payload: null };
    if (clientToken.payload) {
      return clientToken.payload.userId;
    }
  }

  return '';
}

/**
 * 读取ssl文件
 *
 * @export
 * @returns
 */
export function sslReader() {
  const key = cwdResolve(config.get('ssl')['key']);
  const cert = cwdResolve(config.get('ssl')['crt']);
  return {
    key: fs.readFileSync(key).toString(),
    cert: fs.readFileSync(cert).toString()
  };
}

/**
 * 替换markdown中的图片语法
 *
 * @export
 * @param {string} s
 * @returns
 */
export function replaceMDImg(s: string) {
  return s.replace(/!\[.*\](.*)/g, '[image]');
}
