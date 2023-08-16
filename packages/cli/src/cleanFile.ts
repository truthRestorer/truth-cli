import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { distPath, logCleanError, logCleanFinish } from './const.js'

// 清空目录函数
export async function cleanFiles() {
  const files = ['graph.json', 'tree.json', 'relations.json', 'versions.json']
  try {
    for (let i = 0; i < files.length; i++)
      await unlink(resolve(distPath, `./${files[i]}`))
    logCleanFinish()
  }
  catch (err) {
    logCleanError()
  }
}