import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as KoaStatic from 'koa-static';
import * as KoaBody from 'koa-body';
import Router from './middleware/router';
import DbConnection from './db';
import config from './config';
import { terminalLog } from './libs/log';
import { cwdResolve } from './libs/utils';

const app = new Koa();
const router = new Router(app);

// 连接数据库
DbConnection(config.get('mongo')[config.get('env')]);

// 跨域
app.use(cors());

// post请求获取参数
// app.use(BodyParser());

// 静态资源
app.use(KoaStatic(process.cwd()));

// request 获取文件上传
app.use(
  KoaBody({
    multipart: true,
    patchKoa: true,
    strict: false, // 如果为true，不解析GET,HEAD,DELETE请求
    formidable: {
      maxFieldsSize: config.get('upload')['maxUploadSize'] * 1024 * 1024
    }
  })
);

// 注册路由
router.register(`${__dirname}/controller`);

app.listen(config.get('port'));

terminalLog(`Server running on port ${config.get('port')}`);
