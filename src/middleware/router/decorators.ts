import * as Router from 'koa-router';
import MyRouter, { routerPrefixSymbol } from './index';
import { verifyToken } from '../auth';
import { verifyPrivilege } from '../privilege';
import { isToArray } from '../../libs';
import { sucLog, keyword } from '../../libs/log';
import { Status } from '../../constants/enum';

/**
 * 封装函数
 * 方法装饰器 函数
 * @param middleware
 */
function buildMethodDecorator(middleware: Router.IMiddleware): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    (target as any)[propertyKey] = isToArray((target as any)[propertyKey]);
    (target as any)[propertyKey].splice((target as any)[propertyKey].length - 1, 0, middleware);
  };
}

/**
 * Router url前缀 装饰器
 * @prefix('/url)
 * @param value
 */
export const prefix = (value: string): ClassDecorator => target => {
  target.prototype[routerPrefixSymbol] = value;
};

/**
 * 路由信息 装饰器
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

export const router = (config: IRouterConfig): MethodDecorator => (target, propertyKey, descriptor) => {
  MyRouter.__DecoratedRouters.set(
    {
      target,
      method: config.method,
      path: config.path
    },
    (target as any)[propertyKey]
  );
};

/**
 * @log
 * 日志 装饰器
 */
let requestID = 0;
export const log = buildMethodDecorator(logger());
function logger(): Router.IMiddleware {
  return async (ctx, next) => {
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
      `${keyword('magenta')('←')} (ID:${currentRequestID}) ${keyword('cyan')(ctx.method)} ${keyword('yellow')(
        ctx.url
      )} : Status(${keyword('white')(ctx.status.toString())}) Time(${keyword('white')(elapsed.toFixed(0) + 'ms')})`
    );
  };
}

/**
 * @ required
 * 必填参数验证 装饰器
 * @param rules
 */
export const required = (rules: string[]) => buildMethodDecorator(requireder(rules));

function requireder(rules: string[]): Router.IMiddleware {
  return async (ctx, next) => {
    if (ctx.method.toLocaleLowerCase() === 'get') {
      for (let name of rules) {
        if (!ctx.query[name]) {
          return (ctx.body = {
            code: Status.error,
            data: null,
            msg: `${ctx.method} Request query: ${name} required`
          });
        }
      }
    } else {
      for (let name of rules) {
        if (!(<any>ctx.request.body)[name]) {
          return (ctx.body = {
            code: Status.error,
            data: null,
            msg: `${ctx.method} Request params: ${name} required`
          });
        }
      }
    }
    await next();
  };
}

/**
 * @auth
 * 验证 装饰器
 */
export const auth = buildMethodDecorator(verifyToken);

/**
 * @
 * 权限 装饰器
 */
export const privilege = (privilegeType: number) => buildMethodDecorator(verifyPrivilege(privilegeType));
