import { createServer } from 'node:http'
import { readFileSync, watchFile } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logRedload, logWebStart } from './const.js'

let reloadTimes = 0

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
  server.close()
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      server.listen(++port, () => {
        logWebStart(Date.now() - begin, port)
      })
    }
  })
  server.listen(port, () => {
    reloadTimes || logWebStart(Date.now() - begin, port)
  })
}

watchFile('package.json', () => {
  logRedload(++reloadTimes)
  startWebServer()
})
