import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logWebStart } from './const.js'

// 启动网页
export function startWebServer() {
  const begin = Date.now()
  let port = 3003
  const server = createServer((req, res) => {
    if (req.url === '/') {
      res.setHeader('content-encoding', 'gzip')
      const result = readFileSync(htmlPath)
      res.end(result)
    }
    else {
      const relations = genRelations()
      res.end(JSON.stringify((relations)))
    }
  })
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      server.listen(++port, () => {
        logWebStart(Date.now() - begin, port)
      })
    }
  })
  server.listen(port, () => {
    logWebStart(Date.now() - begin, port)
  })
}
