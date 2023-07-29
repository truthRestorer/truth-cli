import fs from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import genGraphPkgs from './genPkgs/graph'
import { logAnalyzeFinish, logFileWirteError, webPath } from './src/const'

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

export default async function genPkgs() {
  const graphPkgs = await genGraphPkgs()
  try {
    fs.writeFile(`${webPath}/charts.json`, JSON.stringify(graphPkgs))
    startWeb()
    logAnalyzeFinish()
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
