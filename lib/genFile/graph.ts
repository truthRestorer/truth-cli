import type { ILinks, INodes } from '../utils/types'
import { relations } from './relations'

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
      symbolSize: (category + 0.5) * (category + 30),
    })
    nodesMap.add(name)
  }
}

export default async function initGraph() {
  let isRoot = true
  for (const [key, { dependencies, devDependencies, version }] of Object.entries(relations)) {
    const pkgs = Object.assign({}, dependencies, devDependencies)
    for (const [pkgName, pkgVersion] of Object.entries(pkgs))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    if (isRoot) {
      addNode(key, version, EDeps.ROOT)
      isRoot = false
    }
    else {
      addNode(key, version, EDeps.DEPENDENCY)
    }
    for (const target of Object.keys(pkgs)) {
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
