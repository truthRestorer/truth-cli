import { GraphDependency, useAssign, useEntries } from '@truth-cli/shared'
import type { Links, Nodes, Relations } from '@truth-cli/shared'

export function genGraph(relations: Relations) {
  const nodesSet = new Set() // 避免相同的 node
  const { version, devDependencies, dependencies } = relations.__root__
  const links: Links[] = []
  const nodes: Nodes[] = [{
    name: '__root__',
    category: GraphDependency.ROOT,
    value: version ?? 'latest',
  }]
  for (const [pkgName, pkgVersion] of useEntries(useAssign(devDependencies, dependencies))) {
    nodes.push({
      name: pkgName,
      category: GraphDependency.ROOT_DEPENDENCY,
      value: pkgVersion,
    })
    nodesSet.add(pkgName)
    links.push({
      source: pkgName,
      target: '__root__',
    })
  }
  return {
    nodes,
    links,
  }
}
