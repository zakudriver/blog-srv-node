import * as Router from 'koa-router';
import * as Jwt from 'jsonwebtoken';
import redis from '../../redis';
import { errLog, terminalLog } from '../../libs/log';
import config from '../../config';
import { Response } from '../../constants/enum';

const jwt = config.get('jwt');

/**
 * 生成token
 * @param userId 用户id
 */
export function signToken(userId: string) {
  const jwtConfig = config.get('jwt');
  const token = Jwt.sign({ userId }, jwtConfig.secret, { algorithm: 'HS512' });
  return token;
}

/**
 * 验证token
 * @param ctx
 * @param next
 */
export const verifyToken: Router.IMiddleware = async (ctx, next) => {
  const overtimeRes = {
    code: Response.overtime,
    data: null,
    msg: 'Logon failure'
  };
  if (!ctx.request.headers.authorization) {
    return (ctx.body = overtimeRes);
  }

  if (!ctx.request.headers.authorization.split(' ')[1]) {
    return (ctx.body = overtimeRes);
  }

  const clientTokenStr = ctx.request.headers.authorization.split(' ')[1];
  const clientToken: any = Jwt.decode(clientTokenStr, { complete: true });

  if (clientTokenStr && clientToken.payload.userId) {
    const nowTime = new Date().getTime();

    // redis获取token
    const redisTokenStr = await redis.getAsync(clientToken.payload.userId);
    if (!redisTokenStr) {
      return (ctx.body = overtimeRes);
    }
    const redisToken = JSON.parse(redisTokenStr);
    const difference = nowTime - redisToken.time;
    const over = await redis.ttlAsync(clientToken.payload.userId);
    terminalLog(`token过期时间：${over}`);

    if (redisToken.token === clientTokenStr) {
      // 获取uid
      ctx.request.uid = clientToken.payload.userId;
      if (difference <= jwt.settlingtime) {
        await next();
      } else if (difference > jwt.settlingtime && difference <= jwt.overtime) {
        // 重置过期时间
        await redis.setAsync(clientToken.payload.userId, JSON.stringify({ token: clientTokenStr, time: new Date().getTime() }));
        const results = await redis.pexpireAsync(clientToken.payload.userId, jwt.overtime - jwt.settlingtime);
        if (results) {
          await next();
        } else {
          errLog('redis pexpireAsync error');
        }
      }
    } else {
      ctx.body = overtimeRes;
    }
  } else {
    ctx.body = overtimeRes;
  }
};
