import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genGraph, genPkgTree, genPkgs, genRelations, genTree, genVersions } from '@truth-cli/core'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logFileWirteFinished, logLogo } from '@truth-cli/shared'

const relations = genRelations()
/**
 * 方便命令行操作的函数
 */
export async function genWebFile(options: IOptions) {
  const begin = Date.now()
  let { dep, isBoth, isBuild, writePath } = options
  const graph = genGraph()
  const tree = genTree(dep)
  const versions = genVersions()
  if (!writePath)
    writePath = isBuild ? devDistPath : distPath
  await writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
  await writeFile(`${writePath}/graph.json`, JSON.stringify(graph))
  await writeFile(`${writePath}/tree.json`, JSON.stringify(tree))
  await writeFile(`${writePath}/versions.json`, JSON.stringify(versions))
  if (isBoth) {
    const pkgs = genPkgs(dep)
    await writeFile('./pkgs.json', JSON.stringify(pkgs))
    isBuild || logFileWirteFinished(Date.now() - begin, './', 'json')
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
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep)))
    }
    else if (fileType === 'txt') {
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep))
    }
    else {
      await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(genPkgs(dep)))
      await writeFile(path.resolve(p, './treePkgs.txt'), genPkgTree(dep))
    }
    logFileWirteFinished(Date.now() - begin, p, fileType)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
