import fs from 'node:fs/promises'
import path from 'node:path'
import { webPath } from './utils/const'

const files = ['graph.json', 'tree.json', 'relations.json']
// 清空目录函数
export async function cleanFiles() {
  for (let i = 0; i < files.length; i++)
    await fs.unlink(path.resolve(webPath, `./${files[i]}`))
}
