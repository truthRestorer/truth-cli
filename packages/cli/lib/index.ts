import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { distPath, logAnalyzeFinish, logFileWirteError, logFileWirteFinished } from './utils/const.js'
import { genFiles } from './genFile/index.js'

const server = createServer((req, res) => {
  const html = readFileSync(`${distPath}/index.html`)
  const graph = readFileSync(`${distPath}/graph.json`)
  const relations = readFileSync(`${distPath}/relations.json`)
  const tree = readFileSync(`${distPath}/tree.json`)
  const versions = readFileSync(`${distPath}/versions.json`)
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
) {
  const begin = Date.now()
  try {
    await genFiles(dep, isBoth)
    startWeb()
    const end = Date.now()
    logAnalyzeFinish(end - begin)
    isBoth && logFileWirteFinished(end - begin, './')
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
