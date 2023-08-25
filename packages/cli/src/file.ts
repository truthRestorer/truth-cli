import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { genJson, genTxt } from '@truth-cli/core'
import { logError, logFileWirteFinished } from './const.js'

// 写入文件
export function genFile(depth: number, type: 'json' | 'txt', p: string) {
  const begin = Date.now()
  try {
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'json')
      writeFileSync(writePath, JSON.stringify(genJson(depth, relations)))
    else
      writeFileSync(writePath, genTxt(depth, relations))
    logFileWirteFinished(Date.now() - begin, writePath)
  }
  catch (err: any) {
    logError(err.message)
  }
}
