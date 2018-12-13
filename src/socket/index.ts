import * as http from 'http';
import * as Koa from 'koa';
import * as IO from 'socket.io';
import config from '../config';
import { terminalLog, errLog } from '../libs/log';
import { Event, Status } from '../constants/enum';

export class SocketIO {
  koa: Koa;
  isToken = true;
  private _tasks: { event: Event; cb: (params: any) => void }[] = [];

  private _io: IO.Server;
  private _socket: IO.Socket | null = null;
  private _socketid: string = '';
  constructor(app: Koa) {
    const server = http.createServer(app.callback());
    this._io = IO(server);
    this._connection();
    this._disconnect();
    server.listen(config.get('wspost'));
    this.koa = app;
  }

  private _runTasks(socket: IO.Socket) {
    if (this._tasks.length) {
      this._tasks.forEach(i => {
        socket.on(i.event, i.cb);
      });
    }
  }

  /**
   * 建立socket连接，并获取socket.id，监听默认事件
   *
   * @private
   * @memberof SocketIO
   */
  private _connection() {
    this._io.on('connection', socket => {
      terminalLog(`SOCKET.IO connecting ->>>> ${socket.id}  ${socket.conn.remoteAddress}`);
      this._socketid = socket.id;
      this._socket = socket;
      this._runTasks(socket);
    });
  }

  /**
   * 断开链接
   *
   * @private
   * @memberof SocketIO
   */
  private _disconnect() {
    this._io.on('disconnect', () => {
      errLog(`SOCKET.IO disconnect <<<<- `);
    });
  }

  emit(event: Event, data: any) {
    if (this._socketid && this.isToken) {
      this._io.to(this._socketid).emit(event, data);
    } else {
      this._handleErrEmit(event);
    }
  }

  /**
   * 接收到的数据 判断token
   *
   * @private
   * @param {Event} event
   * @param {(p: any) => void} _cb
   * @returns
   * @memberof SocketIO
   */
  private _handleCB(event: Event, _cb: (p: any) => void) {
    return (params: any) => {
      if (params.token && this.isToken) {
        this.koa.context.socketToken = params.token;
        _cb(params);
      } else {
        this._handleErrEmit(event);
      }
    };
  }

  /**
   * 错误处理推送
   *
   * @private
   * @param {Event} event
   * @memberof SocketIO
   */
  private _handleErrEmit(event: Event) {
    this._io.to(this._socketid).emit(event, {
      code: Status.overtime,
      msg: 'socket token failed'
    });
  }

  on(event: Event, _cb: (params: any) => void) {
    if (this._socket) {
      this._socket.on(event, this._handleCB(event, _cb));
    } else {
      this._tasks.push({
        event,
        cb: this._handleCB(event, _cb)
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
  const socket = new SocketIO(app);
  app.context.io = socket;
  app.context.io.on(Event.SubscribeMessage, d => {
    console.log('SubscribeMessage');
    console.log(d);
  });
}
