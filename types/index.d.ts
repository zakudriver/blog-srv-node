import * as Koa from 'koa';
import * as IO from 'socket.io';

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
    permission: number;
  }

  export namespace Koa {
    interface BaseContext {
      io: any;
    }
  }
}
