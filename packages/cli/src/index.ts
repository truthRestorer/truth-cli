import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logLogo, logWebStart } from '@truth-cli/shared'
import { genJSONFile, genWebFile } from './genFile.js'

const server = function (webPath: string) {
  return createServer((req, res) => {
    const html = readFileSync(`${webPath}/index.html`)
    const graph = readFileSync(`${webPath}/graph.json`)
    const relations = readFileSync(`${webPath}/relations.json`)
    const tree = readFileSync(`${webPath}/tree.json`)
    const versions = readFileSync(`${webPath}/versions.json`)
    if (req.url === '/graph.json')
      res.end(graph)
    else if (req.url === '/relations.json')
      res.end(relations)
    else if (req.url === '/tree.json')
      res.end(tree)
    else if (req.url === '/versions.json')
      res.end(versions)
    else
      res.end(html)
  })
}
/**
 * 启动服务器
 */
function startWeb(begin: number, isDev?: boolean) {
  logWebStart(Date.now() - begin)
  const webStartPath = isDev ? devDistPath : distPath
  server(webStartPath).listen(3002)
}
/**
 * 命令行操作函数
 */
export async function genByCommand(options: IOptions) {
  logLogo()
  const { dep, isBoth, isDev, isDeploy, jsonPath } = options
  const begin = Date.now()
  try {
    // 表示生成 pkgs.json 不打开网页
    if (jsonPath) {
      await genJSONFile(dep, jsonPath)
      return
    }
    await genWebFile({ dep, isBoth, isDev })
    // 如果是 deploy 环境下，不启动网页
    if (!isDeploy)
      startWeb(begin, isDev)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
