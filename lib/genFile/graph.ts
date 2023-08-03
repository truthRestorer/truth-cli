import { assign, entries } from '../utils/tools.js'
import type { ILinks, INodes } from '../utils/types.js'
import { relations } from './relations.js'

const nodesSet = new Set()

enum EDeps {
  DEPENDENCY,
  ROOT,
}
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
  category && (add.symbolSize = 40)
  nodes.push(add)
  nodesSet.add(name)
}

/**
 * 递归获得最终 graph 图所需要的数据
 */
function loadGraph() {
  let isRoot = true
  for (const { name, dependencies, devDependencies, version } of Object.values(relations)) {
    const pkgs = assign(dependencies, devDependencies)
    for (const [pkgName, pkgVersion] of entries(pkgs))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    if (isRoot) {
      addNode(name, version, EDeps.ROOT)
      isRoot = false
    }
    else {
      addNode(name, version, EDeps.DEPENDENCY)
    }
    for (const [source, version] of entries(pkgs)) {
      links.push({
        source,
        target: name,
        v: version as string,
      })
    }
  }
}

/**
 * 导出易于命令行操作的函数
 */
export async function genGraph() {
  loadGraph()
  return {
    nodes,
    links,
  }
}
