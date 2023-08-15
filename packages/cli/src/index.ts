import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logLogo, logWebStart } from '@truth-cli/shared'
import { genWebFile } from './genFile.js'

const startServer = function (webPath: string) {
  return createServer((req, res) => {
    const html = readFileSync(`${webPath}/index.html.gz`)
    const graph = readFileSync(`${webPath}/graph.gz`)
    const relations = readFileSync(`${webPath}/relations.gz`)
    const tree = readFileSync(`${webPath}/tree.gz`)
    const versions = readFileSync(`${webPath}/versions.gz`)
    res.setHeader('content-encoding', 'gzip')
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
/**
 * 命令行操作函数
 */
export async function genByCommand(options: IOptions) {
  logLogo()
  const { dep, isBoth, isVercelBuildOrDev } = options
  const begin = Date.now()
  try {
    // 表示生成 pkgs.json 不打开网页
    await genWebFile({ dep, isBoth, isVercelBuildOrDev })
    const webStartPath = isVercelBuildOrDev ? devDistPath : distPath
    if (!isVercelBuildOrDev) {
      logWebStart(Date.now() - begin)
      startServer(webStartPath).listen(3002)
    }
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
