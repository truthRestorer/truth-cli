import { GraphDependency, assign, entries } from '@truth-cli/shared'
import type { Links, Nodes, Relations } from '@truth-cli/shared'

const nodesSet = new Set() // 避免相同的 node
const nodes: Nodes[] = []
const links: Links[] = []

/**
 * 向 nodes 中添加节点，生成 graph 图所需要的 data 数据
 */
function addNode(name: string, version: string, category: number) {
  if (nodesSet.has(name))
    return
  const add: Nodes = {
    name,
    category,
    value: version,
  }
  nodes.push(add)
  nodesSet.add(name)
}

/**
 * 导出易于命令行操作的函数
 */
export function genGraph(relations: Relations) {
  const { name, version, devDependencies, dependencies } = relations.__root__
  const rootName = name ?? '__root__'
  for (const [pkgName, pkgVersion] of entries(assign(devDependencies, dependencies))) {
    addNode(pkgName, pkgVersion, GraphDependency.ROOT_DEPENDENCY)
    links.push({
      source: pkgName,
      target: rootName,
    })
  }
  addNode(rootName, version ?? 'latest', GraphDependency.ROOT)
  return {
    nodes,
    links,
  }
}
