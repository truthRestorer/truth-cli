import fs from 'node:fs/promises'
import { devWebPath, webPath } from '../utils/const.js'
import { genGraph } from './graph.js'
import { genRelations } from './relations.js'
import { genTree } from './tree.js'
import { outputFile } from './outputFile.js'

async function genData(payload: { treeDep: number }) {
  const { treeDep } = payload
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

export async function genFiles(
  pkgDep: number,
  treeDep: number,
  isWeb?: boolean,
  isDev?: boolean,
) {
  const { relations, graph, tree } = await genData({ treeDep })
  !isWeb && await outputFile(pkgDep, './')
  const writePath = isDev ? `${devWebPath}/public` : webPath
  await fs.writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
  await fs.writeFile(`${writePath}/graph.json`, JSON.stringify(graph))
  await fs.writeFile(`${writePath}/tree.json`, JSON.stringify(tree))
}
