import * as Koa from 'koa';
import * as cors from '@koa/cors';
import Router from './middleware/router';
import DbConnection from './db';
import config from './config';
import { use } from 'nconf';

const app = new Koa();
const router = new Router(app);

DbConnection(config.get('mongo')[config.get('env')]);
// app.use(ctx => {
//   ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
// });

app.use(cors());

// 注册路由
router.register(`${__dirname}/api`, {
  secret: config.get('jwt').secret,
  key: config.get('jwt').key
});

app.listen(config.get('port'));

console.log(`Server running on port ${config.get('port')}`);
