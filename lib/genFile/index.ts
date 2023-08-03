import fs from 'node:fs/promises'
import path from 'node:path'
import { devWebPath, logFileWirteError, logFileWirteFinished, logLogo, webPath } from '../utils/const.js'
import { genGraph } from './graph.js'
import { genRelations } from './relations.js'
import { genTree } from './tree.js'
import { genPkgs } from './pkgs.js'

/**
 * 生成网页所需要的数据(tree 图和 graph 图)
 */
async function genData(treeDep: number) {
  // relaitons 是一切 json 数据生成的基础，所以应该放在最前面
  const relations = await genRelations()
  const graph = await genGraph()
  const tree = await genTree(treeDep)
  return {
    relations,
    graph,
    tree,
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
  try {
    const { relations, graph, tree } = await genData(treeDep)
    const writePath = isDev ? `${devWebPath}/public` : webPath
    await fs.writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
    await fs.writeFile(`${writePath}/graph.json`, JSON.stringify(graph))
    await fs.writeFile(`${writePath}/tree.json`, JSON.stringify(tree))
    if (isBoth) {
      const pkgs = await genPkgs(pkgDep)
      await fs.writeFile('./pkgs.json', JSON.stringify(pkgs))
    }
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}

export async function genJSONFile(
  pkgDep: number,
  p: string | boolean,
) {
  logLogo()
  const begin = Date.now()
  p = typeof p === 'boolean' ? './' : p
  try {
    await genRelations()
    const pkgs = await genPkgs(pkgDep)
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
  finally {
    const end = Date.now()
    logFileWirteFinished(end - begin, p)
  }
}
