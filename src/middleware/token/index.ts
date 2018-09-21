import * as Koa from 'koa';
import * as Jwt from 'jsonwebtoken';
import config from '../../config';

interface IVerifyToken {
  (ctx: Koa.Context, decodedToken: object, token: string): Promise<boolean>;
}

/**
 * 验证token
 * @param ctx
 * @param decodedToken
 * @param token
 */
export const verifyToken: IVerifyToken = (ctx, decodedToken, token) => {
  const jwtConfig = config.get('jwt');
  console.log('verify')
  return Promise.resolve(true);

  try {
    // const tkn = Jwt.verify(token, jwtConfig.secret);
    // console.log(tkn);
    ctx.body = {
      msg: 'token过期'
    };

    return Promise.resolve(false);
  } catch (e) {
    ctx.throw(401, 'Invalid token, please restart');
    return Promise.resolve(true);
  }
};

/**
 * 生成token
 * @param userId 用户id
 */
export function signToken(userId: string) {
  const jwtConfig = config.get('jwt');
  const token = Jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.time });
  return token;
}
