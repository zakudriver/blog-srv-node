import * as mongoose from 'mongoose'
import config from '../config'

mongoose.connect(config.mongodb)

//连接成功终端显示消息
mongoose.connection.on('connected', () => {
  console.log('mongoose connection open to ' + config.mongodb)
})
//连接失败终端显示消息
mongoose.connection.on('error', () => {
  console.log('mongoose error ')
})
//连接断开终端显示消息
mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected')
})

export default mongoose
