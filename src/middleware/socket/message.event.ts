import * as Router from 'koa-router';
import * as Koa from 'koa';
import { Event } from '../../constants/enum';
import MessageMod, { IMessage } from '../../db/model/message';
import { sucLog } from '../../libs/log';
import { SocketIO } from '../../socket';

export function onMessage(io: SocketIO) {
  sucLog('onMessage');
  io.on(Event.SubscribeMessage, params => {
    emitMessage(io);
  });
}

export async function emitMessage(io: SocketIO, msg?: IMessage) {
  let emitData: IMessage[] = [];
  if (msg) {
    emitData.push(msg);
  } else {
    emitData = await MessageMod.find({ isRead: false }, { article: 1, name: 1, time: 1, text: 1, _id: 1 }).populate(
      'article',
      'title'
    );
  }
  io.emit(Event.Message, emitData);
}
