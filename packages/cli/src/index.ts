import { createServer } from 'node:http'
import path from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { htmlPath, logCommonError, logFileWirteFinished, logLogo, logWebStart } from './const.js'

const relations = genRelations()
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
    res.end(JSON.stringify((relations)))
  }
})

export async function genByCommand() {
  const begin = Date.now()
  logLogo()
  try {
    server.listen(3002)
    logWebStart(Date.now() - begin)
  }
  catch (err: any) {
    logCommonError(err.message)
  }
}

/**
 * 只写入文件，不打开网页
 */
export async function genPkgsFile(
  depth: number,
  type: 'json' | 'txt',
  p?: string | boolean,
) {
  logLogo()
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
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
