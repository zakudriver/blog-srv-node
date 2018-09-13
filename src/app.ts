import * as Koa from 'koa'
import * as Router from 'koa-router'
import config from './config'

const app = new Koa()
const router = new Router()

app.use(router.routes())
app.listen(config.prot)

console.log(`Server running on port ${config.prot}`)


