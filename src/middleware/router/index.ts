import * as path from 'path';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import * as Glob from 'glob';
import { IRouterConfig } from './decorators';

export interface IDecoratedRouters extends IRouterConfig {
  target: any;
}

export const routerPrefixSymbol: symbol = Symbol('routerPrefix');

export default class MyRouter {
  private router: Router;
  private app: Koa;
  static __DecoratedRouters: Map<IDecoratedRouters, Router.IMiddleware | Router.IMiddleware[]> = new Map();

  constructor(app: Koa) {
    this.router = new Router();
    this.app = app;
  }

  public register(controllerDir: string) {
    Glob.sync(path.join(controllerDir, './*.?s')).forEach(i => {
      require(i);
    });

    for (let [config, controller] of MyRouter.__DecoratedRouters) {
      let prefixPath: string = config.target[routerPrefixSymbol];
      if (prefixPath && !prefixPath.startsWith('/')) {
        prefixPath = `/${prefixPath}`;
      }
      let routerPath = prefixPath + config.path;

      if (Array.isArray(controller)) {
        controller.forEach(i => {
          this.router[config.method](routerPath, i);
        });
      } else {
        this.router[config.method](routerPath, controller);
      }
    }

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods()); // ctx.status为空或者404的时候,丰富response对象的header头
  }
}
