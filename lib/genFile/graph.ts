// 生成 echarts 中 graph 所需要的数据
import type { ILinks, INodes } from '../utils/types'
import initRelations from './relations'

const nodesMap = new Map()
const nodes: INodes[] = []
const links: ILinks[] = []
enum EDeps {
  DEPENDENCY,
  ROOT,
}
function addNode(name: string, version: string, category: number) {
  if (!nodesMap.has(name)) {
    nodes.push({
      name,
      category,
      value: version,
      symbolSize: (category + 0.5) * (category + 30),
    })
    nodesMap.set(name, category)
  }
}

export default async function initGraph() {
  const relations = await initRelations()
  for (const [key, { dependencies, devDependencies, version }] of Object.entries(relations)) {
    for (const [pkgName, pkgVersion] of Object.entries(dependencies ?? {}))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    for (const [pkgName, pkgVersion] of Object.entries(devDependencies ?? {}))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    const pkg = Object.assign({}, dependencies, devDependencies)
    addNode(key, version, EDeps.DEPENDENCY)
    for (const target of Object.keys(pkg)) {
      links.push({
        source: key,
        target,
      })
    }
  }
  return {
    nodes,
    links,
  }
}
