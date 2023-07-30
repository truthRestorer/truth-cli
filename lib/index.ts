import fs from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import genGraph from './genFile/graph'
import genRelatios from './genFile/relations'
import { logAnalyzeFinish, logFileWirteError, webPath } from './utils/const'

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

export async function genPkgsAndWeb() {
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = await genRelatios()
  const graphPkgs = await genGraph()
  try {
    await fs.writeFile(`${webPath}/relations.json`, JSON.stringify(relations))
    await fs.writeFile(`${webPath}/graph.json`, JSON.stringify(graphPkgs))
    startWeb()
    logAnalyzeFinish()
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
