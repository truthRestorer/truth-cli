/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import genGraphPkgs from './genPkgs/graph'
import { logWebStart, webPath } from './src/const'

const app = express()
app.use(express.static(webPath))

function startWeb() {
  app.get('/', (req, res) => {
    const indexPath = path.resolve(webPath, './index.html')
    const htmlStr = fs.readFileSync(indexPath)
    res.end(htmlStr)
  })
  app.listen('3002')
}

export default function genPkgs() {
  const graphPkgs = genGraphPkgs()

  fs.writeFile(`${webPath}/charts.json`, JSON.stringify(graphPkgs), (err) => {
    if (err)
      console.log(err.message)
    console.log('done')
  })
  startWeb()
  logWebStart()
}
