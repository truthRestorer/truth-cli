import { assign, entries } from '../utils/tools.js'
import type { ILinks, INodes } from '../utils/types.js'
import { relations } from './relations.js'

const nodesSet = new Set()

enum EDeps {
  DEPENDENCY,
  ROOT,
}

function loadGraph(nodes: INodes[], links: ILinks[]) {
  function addNode(name: string, version: string, category: number) {
    if (!nodesSet.has(name)) {
      const add: INodes = {
        name,
        category,
        value: version,
      }
      category && (add.symbolSize = 40)
      nodes.push(add)
      nodesSet.add(name)
    }
  }
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

export async function genGraph() {
  const nodes: INodes[] = []
  const links: ILinks[] = []
  loadGraph(nodes, links)
  return {
    nodes,
    links,
  }
}
