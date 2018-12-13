import * as Router from 'koa-router';
import * as Koa from 'koa';
import { Event } from '../../constants/enum';
import MessageMod, { IMessage } from '../../db/model/message';
import { sucLog } from '../../libs/log';

export const onMessage: Router.IMiddleware = (ctx, next) => {
  sucLog('onMessage');

  ctx.io.on(Event.SubscribeMessage, params => {
    sucLog('socket token验证');

    if (ctx.request.headers.authorization === params.token) {
      sucLog('socket token验证通过');
      emitMessage(ctx);
    }
  });
};

export async function emitMessage(ctx: Koa.Context, msg?: IMessage) {
  let emitData: IMessage[] = [];
  if (msg) {
    emitData.push(msg);
  } else {
    emitData = await MessageMod.find({ isRead: false });
  }
  ctx.io.emit(Event.Message, emitData);
}
