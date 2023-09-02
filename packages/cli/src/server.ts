import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logFinished, workPath } from './const.js'

// 启动网页
export function startWebServer() {
  const begin = Date.now()
  let port = 3003
  const relations = gzipSync(JSON.stringify(genRelations()))
  const html = readFileSync(htmlPath)
  const worker = readFileSync(workPath)
  const server = createServer((req, res) => {
    if (req.url === '/') {
      res.setHeader('content-encoding', 'br')
      res.end(html)
    }
    else if (req.url === '/relations.json') {
      res.setHeader('content-encoding', 'gzip')
      res.end(relations)
    }
    else {
      res.setHeader('content-encoding', 'br')
      res.end(worker)
    }
  })
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      server.listen(++port, () => {
        logFinished(Date.now() - begin, port)
      })
    }
  })
  server.listen(port, () => {
    port === 3003 && logFinished(Date.now() - begin, port)
  })
}
