import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'
import { genGraph, genPkgTree, genPkgs, genTree, genVersions } from '@truth-cli/core'
import type { IOptions } from '@truth-cli/shared'
import { genRelations } from './lib/relations.js'
import { devDistPath, distPath, logFileWirteError, logFileWirteFinished, logLogo } from './utils/const.js'

const relations: any = genRelations()
/**
 * 方便命令行操作的函数
 */
export async function genWebFile(options: IOptions) {
  const begin = Date.now()
  let { dep, isBoth, isVercelBuildOrDev, writePath } = options
  let suffix = '.json'
  let graph: any = JSON.stringify(genGraph(relations))
  let tree: any = JSON.stringify(genTree(dep, relations))
  let versions: any = JSON.stringify(genVersions(relations))
  let newRelations: any = JSON.stringify(relations)
  if (!isVercelBuildOrDev) {
    graph = zlib.gzipSync(graph)
    tree = zlib.gzipSync(tree)
    versions = zlib.gzipSync(versions)
    newRelations = zlib.gzipSync(JSON.stringify(relations))
    suffix = '.gz'
  }
  if (!writePath)
    writePath = isVercelBuildOrDev ? devDistPath : distPath
  await writeFile(`${writePath}/relations${suffix}`, newRelations)
  await writeFile(`${writePath}/graph${suffix}`, graph)
  await writeFile(`${writePath}/tree${suffix}`, tree)
  await writeFile(`${writePath}/versions${suffix}`, versions)
  if (isBoth) {
    const pkgs = genPkgs(dep, relations)
    await writeFile('./pkgs.json', JSON.stringify(pkgs))
    isVercelBuildOrDev || logFileWirteFinished(Date.now() - begin, './', 'json')
  }
}

/**
 * 只写入文件，不打开网页
 */
export async function genOutputFile(
  dep: number,
  fileType: 'json' | 'txt' | 'both',
  p?: string | boolean,
) {
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
