import Koa from 'koa'
import koaStatic from 'koa-static'
import { logAnalyzeFinish, logFileWirteError, logFileWirteFinished, webPath } from './utils/const.js'
import { genFiles } from './genFile/index.js'

// TODO: 使用原生 Nodejs 实现启动 web
const app = new Koa()
app.use(koaStatic(webPath))
/**
 * 启动服务器
 */
function startWeb() {
  app.listen(3002)
}
/**
 * 命令行操作函数
 */
export async function genByCommand(
  dep: number,
  isBoth: boolean = false,
  isDev: boolean = false,
) {
  const begin = Date.now()
  try {
    await genFiles(dep, isBoth, isDev)
    !isDev && startWeb()
    const end = Date.now()
    logAnalyzeFinish(end - begin)
    isBoth && logFileWirteFinished(end - begin, './')
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
