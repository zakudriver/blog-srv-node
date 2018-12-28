import * as Jwt from 'jsonwebtoken';

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
