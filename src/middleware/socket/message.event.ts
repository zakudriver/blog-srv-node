import * as moment from 'moment';
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

export async function emitMessage(io: SocketIO) {
  const emitData = await MessageMod.find({ isRead: false }, { article: 1, name: 1, time: 1, text: 1, _id: 1 })
    .populate('article', 'title')
    .lean();

  emitData.forEach((i: IMessage) => {
    i.time = moment(i.time).format('YYYY-MM-DD HH:mm:ss');
    i.text = i.text.substr(0, 10);
  });

  io.emit(Event.Message, emitData);
}
