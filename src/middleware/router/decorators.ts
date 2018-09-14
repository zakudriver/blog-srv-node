import * as Koa from 'koa'
import MyRouter, { routerPrefixSymbol } from './index'

/**
 * Router url前缀
 * @prefix('/url)
 * @param value
 */
export function prefix(value: string): ClassDecorator {
  return target => {
    target.prototype[routerPrefixSymbol] = value
  }
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
  path: string
  method: 'get' | 'post' | 'delete' | 'put' | 'head' | 'options'
}

export function router(config: IRouterConfig): PropertyDecorator {
  return (target, name) => {
    MyRouter.__DecoratedRouters.set(
      {
        target,
        method: config.method,
        path: config.path
      },
      (target as any)[name]
    )
  }
}


export function use(func:Function):PropertyDecorator {
  return (target)=>{
    
  }
}