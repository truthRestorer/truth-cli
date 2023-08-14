import { EDeps, assign, entries } from '@truth-cli/shared'
import type { ILinks, INodes } from '@truth-cli/shared'
import { relations } from './relations.js'

const nodesSet = new Set<string>() // 避免相同的 node
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

/**
 * 导出易于命令行操作的函数
 */
export function genGraph() {
  const { name, version, devDependencies, dependencies } = relations.__root__
  const rootName = name ?? '__root__'
  for (const [pkgName, pkgVersion] of entries(assign(devDependencies, dependencies))) {
    addNode(pkgName, pkgVersion, EDeps.ROOT_DEPENDENCY)
    links.push({
      source: pkgName,
      target: rootName,
    })
  }
  addNode(rootName, version, EDeps.ROOT)
  return {
    nodes,
    links,
  }
}
