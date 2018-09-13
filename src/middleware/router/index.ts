import * as path from 'path'
import * as router from 'koa-router'
import * as koa from 'koa'
import * as glob from 'glob'

interface IDecoratedRouters {
  target: any
  method: string
  path: string
}

export default class Router {
  static __DecoratedRouters: Map<IDecoratedRouters, Function> = new Map()
  private router: router
  private app: koa

  constructor(app: koa) {
    this.router = new router()
    this.app = app
  }

  public register(controllerDir: string) {
    glob.sync(path.join(controllerDir, './*.js')).forEach(i => require(i))
  }
}
