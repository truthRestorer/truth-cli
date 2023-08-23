import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { logError, logFileWirteFinished } from './const.js'

// 写入文件
export function genFile(
  depth: number,
  type: 'json' | 'txt',
  p?: string | boolean,
) {
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'json')
      writeFileSync(writePath, JSON.stringify(genPkgs(depth, relations)))
    else
      writeFileSync(writePath, genPkgTree(depth, relations))
    logFileWirteFinished(Date.now() - begin, p, type)
  }
  catch (err: any) {
    logError(err.message)
  }
}
