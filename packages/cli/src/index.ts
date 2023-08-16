import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { genRelations } from 'packages/core/node.js'
import { distPath, logFileWirteError, logLogo, logWebStart } from './const.js'

const server = createServer(async (req, res) => {
  if (req.url === '/') {
    res.setHeader('content-encoding', 'gzip')
    const result = await readFile(`${distPath}/index.html.gz`)
    res.end(result)
  }
  else {
    const relations = genRelations()
    res.end(JSON.stringify((relations)))
  }
})
/**
 * 启动服务器
 */
/**
 * 命令行操作函数
 */
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
