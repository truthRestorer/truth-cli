import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logLogo, logWebStart } from './utils/const.js'
import { genWebFile } from './genFile.js'

const startServer = function (webPath: string) {
  return createServer(async (req, res) => {
    res.setHeader('content-encoding', 'gzip')
    let result = await readFile(`${webPath}/index.html.gz`)
    if (req.url !== '/') {
      const filePath = req.url?.split('.')[0]
      result = await readFile(`${webPath}${filePath}.gz`)
    }
    res.end(result)
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
