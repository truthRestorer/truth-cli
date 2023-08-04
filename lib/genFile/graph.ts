import { assign, entries } from '../utils/tools.js'
import { EDeps } from '../utils/types.js'
import type { ILinks, INodes } from '../utils/types.js'
import { relations, rootPkg } from './relations.js'

const nodesSet = new Set()
const nodes: INodes[] = []
const links: ILinks[] = []

/**
 * 向 nodes 中添加节点，生成 graph 图所需要的 data 数据
 */
function addNode(name: string, version: string, category: number) {
  if (nodesSet.has(name))
    return
  const add: INodes = {
    name,
    category,
    value: version,
  }
  nodes.push(add)
  nodesSet.add(name)
}

function addGraph(pkgs: any, name: string, type: EDeps = EDeps.DEPENDENCY) {
  for (const [pkgName, pkgVersion] of entries(pkgs)) {
    addNode(pkgName, pkgVersion as string, type)
    links.push({
      source: name,
      target: pkgName,
      v: pkgVersion as string,
    })
  }
}
/**
 * 获得最终 graph 图所需要的数据
 */
function loadGraph() {
  for (const { name, dependencies, devDependencies, version } of Object.values(relations)) {
    const type = name === rootPkg.__root__.name ? EDeps.ROOT_DEPENDENCY : EDeps.DEPENDENCY
    addNode(name, version, type)
    const pkgs = assign(dependencies, devDependencies)
    addGraph(pkgs, name, type)
  }
}

/**
 * 导出易于命令行操作的函数
 */
export async function genGraph() {
  const { name, version } = rootPkg.__root__
  addNode(name, version, EDeps.ROOT)
  loadGraph()
  return {
    nodes,
    links,
  }
}
