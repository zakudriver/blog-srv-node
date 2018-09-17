import * as path from 'path';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import * as Glob from 'glob';
import * as KoaJwt from 'koa-jwt';
import { IRouterConfig } from './decorators';
import { verifyToken } from '../token';

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

  public register(controllerDir: string, jwtOpts: KoaJwt.Options) {
    Glob.sync(path.join(controllerDir, './*.?s')).forEach(i => {
      require(i);
    });

    const unlessPath: string[] = [];

    for (let [config, controller] of MyRouter.__DecoratedRouters) {
      let prefixPath: string = config.target[routerPrefixSymbol];
      if (prefixPath && !prefixPath.startsWith('/')) {
        prefixPath = `/${prefixPath}`;
      }
      let routerPath = prefixPath + config.path;

      if (config.unless) {
        unlessPath.push(routerPath);
      }

      if (Array.isArray(controller)) {
        controller.forEach(i => {
          this.router[config.method](routerPath, i);
        });
      } else {
        this.router[config.method](routerPath, controller);
      }
    }

    this.app.use(
      KoaJwt({ secret: jwtOpts.secret, key: jwtOpts.key, isRevoked: verifyToken, debug: true }).unless({
        path: unlessPath
      })
    );
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods()); // ctx.status为空或者404的时候,丰富response对象的header头
  }
}
