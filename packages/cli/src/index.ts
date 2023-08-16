import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genRelations } from 'packages/core/node.js'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { devDistPath, distPath, logFileWirteError, logFileWirteFinished, logLogo, logWebStart } from './const.js'

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
  logLogo()
  const begin = Date.now()
  try {
    // 表示生成 pkgs.json 不打开网页
    logWebStart(Date.now() - begin)
    server.listen(3002)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}

/**
 * dev 环境或者 vercel 会用到
 */
export async function genWebFile(writePath: string = devDistPath) {
  await writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
}

/**
 * 只写入文件，不打开网页
 */
export async function genOutputFile(
  dep: number,
  fileType: 'json' | 'txt' | 'both',
  p?: string | boolean,
) {
  logLogo()
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    if (fileType === 'json') {
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep, relations)))
    }
    else if (fileType === 'txt') {
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep, relations))
    }
    else {
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep, relations)))
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep, relations))
    }
    logFileWirteFinished(Date.now() - begin, p, fileType)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
