import { EDeps, entries } from '@truth-cli/shared'
import type { ILinks, INodes } from '@truth-cli/shared'
import { relations } from './relations.js'

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

/**
 * 导出易于命令行操作的函数
 */
export async function genGraph() {
  const { name, version, devDependencies, dependencies } = relations.__root__
  for (const [pkgName, pkgVersion] of entries(Object.assign(devDependencies, dependencies))) {
    addNode(pkgName, pkgVersion, EDeps.ROOT_DEPENDENCY)
    links.push({
      source: pkgName,
      target: name,
      v: pkgVersion as string,
    })
  }
  addNode(name, version, EDeps.ROOT)
  return {
    nodes,
    links,
  }
}
