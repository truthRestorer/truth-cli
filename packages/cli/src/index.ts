import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genRelations } from '@truth-cli/core/node'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { distPath, logCommonError, logFileWirteFinished, logLogo, logWebStart } from './const.js'

const relations = genRelations()
/**
 * 启动服务器
 */
const server = createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('content-encoding', 'gzip')
    const result = await readFile(`${distPath}/index.html.gz`)
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
    if (type === 'json')
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(depth, relations)))
    else
      await writeFile(path.resolve(p, './pkgs.txt'), genPkgTree(depth, relations))
    logFileWirteFinished(Date.now() - begin, p, type)
  }
  catch (err: any) {
    logCommonError(err.message)
  }
}
