import * as Koa from 'koa'
import Router from './middleware/router'
import config from './config'

const app = new Koa()
const router = new Router(app)

// 注册路由
router.register(`${__dirname}/api`)

app.listen(config.prot)

console.log(`Server running on port ${config.prot}`)
