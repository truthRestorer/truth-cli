import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { genGraph, genPkgTree, genPkgs, genRelations, genTree, genVersions } from '@truth-cli/core'
import type { IOptions } from '@truth-cli/shared'
import { devDistPath, distPath, logFileWirteError, logFileWirteFinished } from '@truth-cli/shared'

/**
 * 生成网页所需要的数据(tree 图和 graph 图)
 */
function genData(treeDep: number) {
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = genRelations()
  const graph = genGraph()
  const tree = genTree(treeDep)
  const versions = genVersions()
  return {
    relations,
    graph,
    tree,
    versions,
  }
}
/**
 * 方便命令行操作的函数
 */
export async function genWebFile(options: IOptions) {
  const begin = Date.now()
  let { dep, isBoth, isDev, writePath } = options
  const { relations, graph, tree, versions } = genData(dep)
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
export async function genJSONFile(pkgDep: number, p?: string | boolean, onlyPlayground = false) {
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    onlyPlayground || genRelations()
    const pkgs = genPkgs(pkgDep)
    await writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
    onlyPlayground || logFileWirteFinished(Date.now() - begin, p)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}

export async function genTxtFile(pkgDep: number, p?: string | boolean, onlyPlayground = false) {
  const begin = Date.now()
  if (!p || typeof p === 'boolean')
    p = './'
  try {
    onlyPlayground || genRelations()
    const pkgTree = genPkgTree(pkgDep)
    await writeFile(path.resolve(p, './treePkgs.txt'), pkgTree)
    onlyPlayground || logFileWirteFinished(Date.now() - begin, p)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
