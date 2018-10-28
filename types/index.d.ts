import * as Koa from 'koa';

declare module 'Koa' {
  export interface BaseContext {
    request: Request;
  }
  export interface Request extends BaseRequest {
    uid: string;
    user: IUser;
  }
  export interface IUser {
    _id: string;
    privilege: number;
  }
}
