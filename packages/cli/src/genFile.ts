import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { genRelations } from '@truth-cli/core/node'
import { devDistPath, logFileWirteError, logFileWirteFinished, logLogo } from './const.js'

/**
 * dev 环境或者 vercel 会用到
 */
export async function genWebFile(writePath: string = devDistPath) {
  const relations = genRelations()
  await writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
}

/**
 * 只写入文件，不打开网页
 */
export async function genOutputFile(
  dep: number,
  fileType: 'json' | 'txt' | 'both',
  p?: string | boolean,
) {
  const relations = genRelations()
  logLogo()
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    if (fileType === 'json') {
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep, relations)))
    }
    else if (fileType === 'txt') {
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep, relations))
    }
    else {
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep, relations)))
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep, relations))
    }
    logFileWirteFinished(Date.now() - begin, p, fileType)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
