import * as Koa from 'koa';

declare module 'Koa' {
  export interface BaseContext {
    request: Request;
  }
  interface Request extends BaseRequest {
    uid: string;
    root: boolean;
  }
}
