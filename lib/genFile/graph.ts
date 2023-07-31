import type { ILinks, INodes } from '../utils/types.js'
import { relations } from './relations.js'

const nodesMap = new Set()
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
      symbolSize: (category + 0.25) * (category + 30),
    })
    nodesMap.add(name)
  }
}

export default async function initGraph() {
  let isRoot = true
  for (const { name, dependencies, devDependencies, version } of Object.values(relations)) {
    const pkgs = Object.assign({}, dependencies, devDependencies)
    for (const [pkgName, pkgVersion] of Object.entries(pkgs))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    if (isRoot) {
      addNode(name, version, EDeps.ROOT)
      isRoot = false
    }
    else {
      addNode(name, version, EDeps.DEPENDENCY)
    }
    for (const target of Object.keys(pkgs)) {
      links.push({
        source: name,
        target,
      })
    }
  }
  return {
    nodes,
    links,
  }
}
