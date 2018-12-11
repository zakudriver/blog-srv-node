import * as http from 'http';
import * as Koa from 'koa';
import * as IO from 'socket.io';
import config from '../config';
import { terminalLog } from '../libs/log';

export const socketIO = (app: Koa) => {
  const server = http.createServer(app.callback());

  const io = IO(server);

  io.on('connection', () => {
    terminalLog('SOCKET.IO connecting');
    io.emit('news', { hello: 'world' });

    app.io = io;
  });

  server.listen(config.get('wspost'));
};
