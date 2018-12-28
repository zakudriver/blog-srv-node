import * as moment from 'moment';
import { Event, Status } from '../../constants/enum';
import MessageMod, { IMessage } from '../../db/model/message';
import { sucLog } from '../../libs/log';
import { SocketIO } from '../../socket';

let emitMessageId: string[] = [];

/**
 * 监听 Message相关事件
 *
 * @export
 * @param {SocketIO} io
 */
export function onMessage(io: SocketIO) {
  sucLog('onMessage');
  
  // 订阅Message
  io.on(Event.SubscribeMessage, params => {
    emitMessage(io);
  });

  // 订阅Message已读
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

/**
 * 发送 Message事件数据
 *
 * @export
 * @param {SocketIO} io
 */
export async function emitMessage(io: SocketIO) {
  const emitData: IMessage[] = await MessageMod.find({ isRead: false }, { article: 1, name: 1, time: 1, text: 1, _id: 1 })
    .populate('article', 'title')
    .lean();

  emitMessageId = emitData.map(i => {
    i.time = moment(i.time).format('YYYY-MM-DD HH:mm:ss');
    i.text = i.text.length >= 30 ? `${i.text.substr(0, 30)}...` : i.text;
    return i._id;
  });

  io.emit(Event.Message, {
    code: Status.ok,
    data: emitData,
    msg: 'message,hold well'
  });
}
