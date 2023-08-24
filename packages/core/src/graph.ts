import { useAssign } from '@truth-cli/shared'
import type { Links, Nodes, Relation } from '@truth-cli/shared'

enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}

export function genGraph(relation: Relation, target?: string, category?: GraphDependency) {
  const {
    name = '__root__',
    version = 'latest',
    devDependencies,
    dependencies,
  } = relation
  const links: Links[] = []
  const nodes: Nodes[] = [{
    name,
    category: category ?? GraphDependency.ROOT,
    value: version,
  }]
  for (const [pkgName, pkgVersion] of Object.entries(useAssign(devDependencies, dependencies))) {
    nodes.push({
      name: pkgName,
      category: target ? GraphDependency.DEPENDENCY : GraphDependency.ROOT_DEPENDENCY,
      value: pkgVersion as string,
    })
    links.push({
      source: pkgName,
      target: target ?? name,
    })
  }
  return {
    nodes,
    links,
  }
}
