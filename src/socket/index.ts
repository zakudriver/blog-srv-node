import * as http from 'http';
import * as Koa from 'koa';
import * as IO from 'socket.io';
import config from '../config';
import { terminalLog } from '../libs/log';

type Event = 'Message' | 'SubscribeMessage';

export class SocketIO {
  private _io: IO.Server;
  private _socket: IO.Socket | null = null;
  private _socketid: string = '';
  constructor(app: Koa) {
    const server = http.createServer(app.callback());
    this._io = IO(server);

    this._connection();
    server.listen(config.get('wspost'));
  }

  private _connection() {
    this._io.on('connection', socket => {
      terminalLog(`SOCKET.IO connecting ->>>> ${socket.id}  ${socket.conn.remoteAddress}`);
      this._socketid = socket.id;
      this._socket = socket;
    });
  }

  emit(event: Event, data: any) {
    this._io.to(this._socketid).emit(event, data);
  }

  on(event: Event) {
    this._socket!.on(event, (d: any) => {
      console.log('SubscribeMessage');
      console.log(d);
    });
  }
}

/**
 * 连接并注入socket
 *
 * @export
 * @param {Koa} app
 */
export function socketIO(app: Koa) {
  app.context.io = new SocketIO(app);
  app.context.io.on('SubscribeMessage');
}
