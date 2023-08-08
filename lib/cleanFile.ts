import fs from 'node:fs/promises'
import path from 'node:path'
import { distPath, logCleanError, logCleanFinish } from './utils/const.js'

const files = ['graph.json', 'tree.json', 'relations.json']
// 清空目录函数
export async function cleanFiles() {
  try {
    for (let i = 0; i < files.length; i++)
      await fs.unlink(path.resolve(distPath, `./${files[i]}`))
    logCleanFinish()
  }
  catch (err) {
    logCleanError()
  }
}
