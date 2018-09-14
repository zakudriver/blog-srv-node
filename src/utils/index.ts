/**
 *
 *确认是否为Array
 * @export
 * @param {*} params
 * @returns {any[]}
 */
export function isToArray(params: any): any[] {
  return Array.isArray(params) ? params : [params]
}
