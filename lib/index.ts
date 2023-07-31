import fs from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import genGraph from './genFile/graph.js'
import genRelatios from './genFile/relations.js'
import genTree from './genFile/tree.js'
import { devWebPath, logAnalyzeFinish, logFileWirteError, webPath } from './utils/const.js'

// TODO: 使用原生 Nodejs 实现启动 web
const app = express()
app.use(express.static(webPath))

function startWeb() {
  app.get('/', async (req, res) => {
    const indexPath = path.resolve(webPath, './index.html')
    const htmlStr = await fs.readFile(indexPath)
    res.end(htmlStr)
  })
  app.listen('3002')
}

export async function genPkgsAndWeb(payload: { treeDep: number; isDev?: boolean }) {
  const { treeDep, isDev } = payload
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = await genRelatios()
  const graphPkgs = await genGraph()
  const treePkgs = await genTree(treeDep)
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
