import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { devDistPath, distPath, logAnalyzeFinish, logFileWirteError, logFileWirteFinished } from './utils/const.js'
import { genFiles } from './genData/index.js'

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
function startWeb(webPath: string) {
  server(webPath).listen(3002)
}
/**
 * 命令行操作函数
 */
export async function genByCommand(
  dep: number,
  isBoth: boolean = false,
  isDev: boolean = false,
) {
  const begin = Date.now()
  try {
    await genFiles(dep, isBoth, isDev)
    const webPath = isDev ? devDistPath : distPath
    startWeb(webPath)
    const end = Date.now()
    logAnalyzeFinish(end - begin)
    isBoth && logFileWirteFinished(end - begin, './')
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
