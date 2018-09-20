import * as Mongoose from 'mongoose';
import { keyword } from '../libs/log';
import { UserMod } from './model';
import { IUser } from './model/user';

interface Database {
  UserModel: Mongoose.Model<IUser>;
}

export default function DbConnection(dbURL: string): Database {
  (<any>Mongoose).Promise = global.Promise;
  
  Mongoose.connect(dbURL);

  //连接成功终端显示消息
  Mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open to ' + keyword('yellow')(dbURL));
  });
  //连接失败终端显示消息
  Mongoose.connection.on('error', () => {
    console.log('Mongoose error ');
  });
  //连接断开终端显示消息
  Mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
  return {
    UserModel: UserMod
  };
}
