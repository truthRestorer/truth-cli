import Koa from 'koa'
import koaStatic from 'koa-static'
import { logAnalyzeFinish, logFileWirteError, logLogo, webPath } from './utils/const.js'
import { genFiles } from './genFile/index.js'

// TODO: 使用原生 Nodejs 实现启动 web
const app = new Koa()
app.use(koaStatic(webPath))

function startWeb() {
  app.listen(3002)
}

export async function genPkgsAndWeb(payload: { treeDep: number; isDev?: boolean; pkgDep: number; isWeb: boolean }) {
  const { treeDep, isDev, pkgDep, isWeb } = payload
  const begin = Date.now()
  logLogo()
  try {
    genFiles(pkgDep, treeDep, isWeb, isDev)
    if (!isDev) {
      const end = Date.now()
      startWeb()
      logAnalyzeFinish(end - begin)
    }
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
