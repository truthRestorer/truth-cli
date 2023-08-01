import fs from 'node:fs/promises'
import Koa from 'koa'
import koaStatic from 'koa-static'
import genGraph from './genFile/graph.js'
import genRelatios from './genFile/relations.js'
import genTree from './genFile/tree.js'
import { devWebPath, logAnalyzeFinish, logFileWirteError, webPath } from './utils/const.js'
import { outputFile } from './genFile/outputFile.js'

// TODO: 使用原生 Nodejs 实现启动 web
const app = new Koa()
app.use(koaStatic(webPath))

function startWeb() {
  app.listen('3002')
}

export async function genPkgsAndWeb(payload: { treeDep: number; isDev?: boolean; pkgDep: number; isWeb?: boolean }) {
  const { treeDep, isDev, pkgDep, isWeb } = payload
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = await genRelatios()
  const graphPkgs = await genGraph()
  const treePkgs = await genTree(treeDep)
  !isWeb && await outputFile(pkgDep, './', false)
  const writePath = isDev ? `${devWebPath}/public` : webPath
  try {
    await fs.writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
    await fs.writeFile(`${writePath}/graph.json`, JSON.stringify(graphPkgs))
    await fs.writeFile(`${writePath}/tree.json`, JSON.stringify(treePkgs))
    !isDev && startWeb()
    !isDev && logAnalyzeFinish()
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
