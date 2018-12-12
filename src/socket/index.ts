import * as http from 'http';
import * as event from 'events';
import * as Koa from 'koa';
import * as IO from 'socket.io';
import config from '../config';
import { terminalLog } from '../libs/log';

const EventEmitter = event.EventEmitter;

type Event = 'Message' | 'SubscribeMessage';

export class SocketIO {
  private _taskName = Symbol('run');
  private _tasks: { event: Event; cb: (params: any) => void }[] = [];
  private _ready: event.EventEmitter;

  private _io: IO.Server;
  private _socket: IO.Socket | null = null;
  private _socketid: string = '';
  constructor(app: Koa) {
    const server = http.createServer(app.callback());
    this._io = IO(server);
    this._connection();
    server.listen(config.get('wspost'));

    this._ready = new EventEmitter();
    this._registerEvent();
  }

  private _registerEvent() {
    this._ready.on(this._taskName, socket => {
      if (this._tasks.length) {
        this._tasks.forEach(i => {
          socket.on(i.event, i.cb);
        });
      }
    });
  }

  private _connection() {
    this._io.on('connection', socket => {
      terminalLog(`SOCKET.IO connecting ->>>> ${socket.id}  ${socket.conn.remoteAddress}`);
      this._socketid = socket.id;
      this._socket = socket;
      this._ready.emit(this._taskName, socket);
    });
  }

  emit(event: Event, data: any) {
    this._io.to(this._socketid).emit(event, data);
  }

  on(event: Event, cb: (params: any) => void) {
    if (this._socket) {
      this._socket.on(event, cb);
    } else {
      this._tasks.push({
        event,
        cb
      });
    }
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
  // app.context.io.on('SubscribeMessage', d => {
  //   console.log(d);
  // });
}
