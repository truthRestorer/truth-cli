import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logError, logFinished } from './const.js'

// 启动网页
export function startWebServer(port: number = 3003) {
  try {
    port = Number(port)
    if (Number.isNaN(port))
      throw new TypeError('illegal type of [port]')
    const begin = Date.now()
    const html = readFileSync(htmlPath)
    const server = createServer((req, res) => {
      if (req.url === '/') {
        res.setHeader('content-encoding', 'br')
        res.end(html)
      }
      else if (req.url === '/base.json') {
        const relations = gzipSync(JSON.stringify(genRelations()))
        res.setHeader('content-encoding', 'gzip')
        res.end(relations)
      }
    })
    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        server.close()
        server.listen(++port)
      }
    })
    server.listen(port, () => {
      logFinished(Date.now() - begin, port)
    })
  }
  catch (err: any) {
    logError(err.message)
  }
}
