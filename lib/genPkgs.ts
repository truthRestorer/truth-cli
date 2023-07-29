/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import genGraphPkgs from './genPkgs/graph'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const app = express()
app.use(express.static(path.resolve(__dirname, './web/')))

function startWeb() {
  app.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, './web/index.html')
    const htmlStr = fs.readFileSync(indexPath)
    res.end(htmlStr)
  })
  app.listen('3002')
}

export default function genPkgs() {
  const graphPkgs = genGraphPkgs()

  fs.writeFile(`${path.resolve(__dirname, './web')}/charts.json`, JSON.stringify(graphPkgs), (err) => {
    if (err)
      console.log(err.message)
    console.log('done')
  })
  startWeb()
}
