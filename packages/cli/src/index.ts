import { createServer } from 'node:http'
import path from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { htmlPath, logCommonError, logFileWirteFinished, logWebStart } from './const.js'

export function genWeb() {
  const begin = Date.now()
  let port = 3003
  /**
   * 启动服务器
   */
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

/**
 * 只写入文件，不打开网页
 */
export function genPkgsFile(
  depth: number,
  type: 'json' | 'txt',
  p?: string | boolean,
) {
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'json')
      writeFileSync(writePath, JSON.stringify(genPkgs(depth, relations)))
    else
      writeFileSync(writePath, genPkgTree(depth, relations))
    logFileWirteFinished(Date.now() - begin, p, type)
  }
  catch (err: any) {
    logCommonError(err.message)
  }
}
