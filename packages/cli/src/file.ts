import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { genJson, genTxt } from '@truth-cli/core'
import { logError, logFinished } from './const.js'

// 写入文件
export function genFile(depth: any, type: 'json' | 'txt', p: string) {
  try {
    depth = Number(depth)
    if (Number.isNaN(depth))
      throw new TypeError('illegal type of depth')
    const begin = Date.now()
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'json')
      writeFileSync(writePath, JSON.stringify(genJson(depth, relations)))
    else
      writeFileSync(writePath, genTxt(depth, relations))
    logFinished(Date.now() - begin, writePath)
  }
  catch (err: any) {
    logError(err.message)
  }
}
