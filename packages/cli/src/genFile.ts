import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genGraph, genPkgTree, genPkgs, genRelations, genTree, genVersions } from '@truth-cli/core'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logFileWirteFinished } from '@truth-cli/shared'

const relations = genRelations()
/**
 * 方便命令行操作的函数
 */
export async function genWebFile(options: IOptions) {
  const begin = Date.now()
  let { dep, isBoth, isDev, writePath } = options
  const graph = genGraph()
  const tree = genTree(dep)
  const versions = genVersions()
  if (!writePath)
    writePath = isDev ? devDistPath : distPath
  await writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
  await writeFile(`${writePath}/graph.json`, JSON.stringify(graph))
  await writeFile(`${writePath}/tree.json`, JSON.stringify(tree))
  await writeFile(`${writePath}/versions.json`, JSON.stringify(versions))
  if (isBoth) {
    const pkgs = genPkgs(dep)
    await writeFile('./pkgs.json', JSON.stringify(pkgs))
    isDev || logFileWirteFinished(Date.now() - begin, './')
  }
}

/**
 * 只写入文件，不打开网页
 */
export async function genOutputFile(
  dep: number,
  fileType: 'json' | 'txt',
  p?: string | boolean,
) {
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    let pkgs = ''
    if (fileType === 'json')
      pkgs = JSON.stringify(genPkgs(dep))
    else
      pkgs = genPkgTree(dep)
    const writeName = fileType === 'json' ? './pkgs.json' : './treePkgs.txt'
    await writeFile(path.resolve(p, writeName), pkgs)
    logFileWirteFinished(Date.now() - begin, p)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
