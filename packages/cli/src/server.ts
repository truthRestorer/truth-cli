import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { genBaseRelation, genRelations } from '@truth-cli/core/node'
import { htmlPath, logFinished } from './const.js'

// 启动网页
export function startWebServer() {
  const begin = Date.now()
  const base = JSON.stringify(genBaseRelation())
  const html = readFileSync(htmlPath)
  const server = createServer((req, res) => {
    if (req.url === '/') {
      res.setHeader('content-encoding', 'br')
      res.end(html)
    }
    else if (req.url === '/relations.json') {
      const relations = gzipSync(JSON.stringify(genRelations()))
      res.setHeader('content-encoding', 'gzip')
      res.end(relations)
    }
    else if (req.url === '/base.json') {
      res.end(base)
    }
  })
  server.listen(3003, () => {
    logFinished(Date.now() - begin, 3003)
  })
}
