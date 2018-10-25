import * as Koa from 'koa';
import { prefix, router, log, required, auth } from '../middleware/router/decorators';
import { RootMod } from '../db/model';
import { UserMod } from '../db/model';
import { trycatch } from '../libs/utils';

@prefix('/root')
export default class RootController {
  @router({
    path: '',
    method: 'post'
  })
  @auth
  @log
  async addRoot(ctx: Koa.Context) {
    const req = ctx.request.body as { username: string };

    // const newRootUser = new RootMod({ uid:  });
    await trycatch(
      ctx,
      async () => {
        const user = await UserMod.findOne(req);
        console.log(user);

        if (user) {
          const newRootUser = new RootMod({ user: user._id });
          await newRootUser.save({});
          const results = await RootMod.find();
          ctx.body = {
            code: 0,
            data: results,
            msg: 'root add successfully'
          };
        } else {
          ctx.body = {
            code: 1,
            data: null,
            msg: 'user does not exist'
          };
        }
      },
      'root add failed'
    );
  }
}
