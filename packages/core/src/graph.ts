import { useAssign, useEntries } from '@truth-cli/shared'
import type { Links, Nodes, Relation } from '@truth-cli/shared'

enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}

export function genGraph(relation: Relation, target?: string) {
  const { name, version, devDependencies, dependencies } = relation
  const links: Links[] = []
  const nodes: Nodes[] = [{
    name: name ?? '__root__',
    category: GraphDependency.ROOT,
    value: version ?? 'latest',
  }]
  for (const [pkgName, pkgVersion] of useEntries(useAssign(devDependencies, dependencies))) {
    nodes.push({
      name: pkgName,
      category: target ? GraphDependency.DEPENDENCY : GraphDependency.ROOT_DEPENDENCY,
      value: pkgVersion,
    })
    links.push({
      source: pkgName,
      target: target ?? name ?? '__root__',
    })
  }
  return {
    nodes,
    links,
  }
}
