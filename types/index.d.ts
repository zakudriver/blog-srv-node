import * as Koa from 'koa';
import * as IO from 'socket.io';

declare module 'Koa' {
  export interface BaseContext {
    request: Request;
    io: IO.Server;
    socketio: IO.Socket;
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
