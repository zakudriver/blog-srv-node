import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as BodyParser from 'koa-bodyparser';
import Router from './middleware/router';
import DbConnection from './db';
import config from './config';

const app = new Koa();
const router = new Router(app);

// 连接数据库
DbConnection(config.get('mongo')[config.get('env')]);

// 跨域
app.use(cors());

// post请求获取参数
app.use(BodyParser());

// 注册路由
router.register(`${__dirname}/api`, {
  secret: config.get('jwt').secret,
  key: config.get('jwt').key
});

app.listen(config.get('port'));

console.log(`Server running on port ${config.get('port')}`);
