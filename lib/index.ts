import http from 'node:http'
import { readFileSync } from 'node:fs'
import { logAnalyzeFinish, logFileWirteError, logFileWirteFinished, webPath } from './utils/const.js'
import { genFiles } from './genFile/index.js'

const server = http.createServer((req, res) => {
  const html = readFileSync(`${webPath}/index.html`)
  const graph = readFileSync(`${webPath}/graph.json`)
  const relations = readFileSync(`${webPath}/relations.json`)
  const tree = readFileSync(`${webPath}/tree.json`)
  const versions = readFileSync(`${webPath}/versions.json`)
  if (req.url === '/')
    res.end(html)
  else if (req.url === '/graph.json')
    res.end(graph)
  else if (req.url === '/relations.json')
    res.end(relations)
  else if (req.url === '/tree.json')
    res.end(tree)
  else if (req.url === '/versions.json')
    res.end(versions)
})
/**
 * 启动服务器
 */
function startWeb() {
  server.listen(3002)
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
    !isDev && startWeb()
    const end = Date.now()
    logAnalyzeFinish(end - begin)
    isBoth && logFileWirteFinished(end - begin, './')
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
