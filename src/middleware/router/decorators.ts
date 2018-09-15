import MyRouter, { routerPrefixSymbol, IControllerFunc } from './index';
import { isToArray } from '../../utils';
import { sucLog, keyword } from '../../utils/log';

/**
 * Router url前缀
 * @prefix('/url)
 * @param value
 */
export function prefix(value: string): ClassDecorator {
  return target => {
    target.prototype[routerPrefixSymbol] = value;
  };
}

/**
 * 路由信息
 * @router({
 *   method: 'get',
 *   path: '/login/:id'
 * })
 * @param params
 */
export interface IRouterConfig {
  path: string;
  method: 'get' | 'post' | 'delete' | 'put' | 'head' | 'options';
}

export function router(config: IRouterConfig): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    MyRouter.__DecoratedRouters.set(
      {
        target,
        method: config.method,
        path: config.path
      },
      (target as any)[propertyKey]
    );
  };
}

let requestID = 0;
/**
 * @log
 * 日志装饰器
 */
export const log: MethodDecorator = (target, propertyKey, descriptor) => {
  const logger: IControllerFunc = async (ctx, next) => {
    let currentRequestID = requestID++;

    const startTime = process.hrtime();
    sucLog(
      `${keyword('magenta')('→')} (ID:${currentRequestID}) ${keyword('cyan')(ctx.method)} ${keyword('yellow')(ctx.url)} ${
        ctx.body ? keyword('orange')(ctx.body) : ''
      }`
    );
    await next();

    const endTime = process.hrtime();
    const elapsed = (endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1000000;
    sucLog(
      `${keyword('magenta')('←')} (ID:${currentRequestID}) ${keyword('cyan')(ctx.method)} ${keyword('yellow')(ctx.url)} : Status(${keyword(
        'white'
      )(ctx.status.toString())}) Time(${keyword('white')(elapsed.toFixed(0) + 'ms')})`
    );
  };
  (target as any)[propertyKey] = isToArray((target as any)[propertyKey]);
  (target as any)[propertyKey].splice((target as any)[propertyKey].length - 1, 0, logger);
};
