import fs from 'node:fs/promises'
import path from 'node:path'
import { devWebPath, logFileWirteError, logFileWirteFinished, webPath } from '../utils/const.js'
import { genGraph } from './graph.js'
import { genRelations } from './relations.js'
import { genTree } from './tree.js'
import { genPkgs } from './pkgs.js'
import { genVersions } from './versions.js'

/**
 * 生成网页所需要的数据(tree 图和 graph 图)
 */
async function genData(treeDep: number) {
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = await genRelations()
  const graph = await genGraph()
  const tree = await genTree(treeDep)
  const versions = await genVersions()
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
export async function genFiles(
  pkgDep: number,
  treeDep: number,
  isBoth: boolean,
  isDev: boolean,
) {
  const { relations, graph, tree, versions } = await genData(treeDep)
  const writePath = isDev ? `${devWebPath}/public` : webPath
  await fs.writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
  await fs.writeFile(`${writePath}/graph.json`, JSON.stringify(graph))
  await fs.writeFile(`${writePath}/tree.json`, JSON.stringify(tree))
  await fs.writeFile(`${writePath}/versions.json`, JSON.stringify(versions))
  if (isBoth) {
    const pkgs = await genPkgs(pkgDep)
    await fs.writeFile('./pkgs.json', JSON.stringify(pkgs))
  }
}

/**
 * 只写入文件，不打开网页
 */
export async function genJSONFile(pkgDep: number, p: string | boolean) {
  const begin = Date.now()
  p = typeof p === 'boolean' ? './' : p
  try {
    await genRelations()
    const pkgs = genPkgs(pkgDep)
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
    const end = Date.now()
    logFileWirteFinished(end - begin, p)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
