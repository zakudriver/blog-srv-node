import * as Koa from 'koa';

declare module 'Koa' {
  export interface BaseContext {
    uploadname: {};
  }
}
