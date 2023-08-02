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
    const add: INodes = {
      name,
      category,
      value: version,
    }
    category && (add.symbolSize = 40)
    nodes.push(add)
    nodesMap.add(name)
  }
}

export async function genGraph() {
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
    for (const [source, version] of Object.entries(pkgs)) {
      links.push({
        source,
        target: name,
        v: version as string,
      })
    }
  }
  return {
    nodes,
    links,
  }
}
