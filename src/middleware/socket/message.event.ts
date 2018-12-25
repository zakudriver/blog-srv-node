import * as moment from 'moment';
import { Event, Status } from '../../constants/enum';
import MessageMod, { IMessage } from '../../db/model/message';
import { sucLog } from '../../libs/log';
import { SocketIO } from '../../socket';

let emitMessageId: string[] = [];

export function onMessage(io: SocketIO) {
  sucLog('onMessage');
  io.on(Event.SubscribeMessage, params => {
    emitMessage(io);
  });

  io.on(Event.AlreadyMessage, async () => {
    console.log('AlreadyMessage');

    if (emitMessageId.length) {
      try {
        const updateArr: any = emitMessageId.map(i => MessageMod.findByIdAndUpdate(i, { $set: { isRead: true } }));
        await Promise.all(updateArr);
        
        io.emit(Event.Message, {
          code: Status.ok,
          data: null,
          msg: 'message already'
        });
      } catch (err) {
        io.emit(Event.Message, {
          code: Status.error,
          data: null,
          msg: 'message already failed'
        });
      }
    }
  });
}

export async function emitMessage(io: SocketIO) {
  const emitData: IMessage[] = await MessageMod.find(
    { isRead: false },
    { article: 1, name: 1, time: 1, text: 1, _id: 1 }
  )
    .populate('article', 'title')
    .lean();

  emitMessageId = emitData.map(i => {
    i.time = moment(i.time).format('YYYY-MM-DD HH:mm:ss');
    i.text = i.text.substr(0, 10);
    return i._id;
  });

  io.emit(Event.Message, {
    code: Status.ok,
    data: emitData,
    msg: 'message,hold well'
  });
}
