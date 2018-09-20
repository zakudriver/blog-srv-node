/**
 *
 *确认是否为Array,返回Array
 * @export
 * @param {*} params
 * @returns {any[]}
 */
export const isToArray = (params: any) => (Array.isArray(params) ? params : [params]);