import * as Koa from 'koa';
import * as IO from 'socket.io';
import { SocketIO } from '../src/socket';

declare module 'Koa' {
  export interface BaseContext {
    request: Request;
    io: SocketIO;
  }
  export interface Request extends Koa.BaseRequest {
    uid: string;
    user: IUser;
  }

  export interface IUser {
    _id: string;
    permission: number;
  }
}
