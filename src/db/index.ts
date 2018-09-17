import * as Mongoose from 'mongoose';
import config from '../config';

Mongoose.connect(config.get('mongo'));

//连接成功终端显示消息
Mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + config.get('mongo'));
});
//连接失败终端显示消息
Mongoose.connection.on('error', () => {
  console.log('Mongoose error ');
});
//连接断开终端显示消息
Mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default Mongoose;
