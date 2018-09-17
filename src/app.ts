import * as Koa from 'koa';
import Router from './middleware/router';
import config from './config';

const app = new Koa();
const router = new Router(app);

// 注册路由
router.register(`${__dirname}/api`, {
  secret: config.get('jwt').secret,
  key: config.get('jwt').key
});

app.listen(config.get('port'));

console.log(`Server running on port ${config.get('port')}`);
