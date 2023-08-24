import type { Links, Nodes, Relation } from '@truth-cli/shared'

enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}

export function genGraph(relation: Relation, target?: string, category: GraphDependency = GraphDependency.ROOT) {
  const {
    name = '__root__',
    version = 'latest',
    dependencies = {},
    devDependencies,
  } = relation
  const links: Links[] = []
  const nodes: Nodes[] = []
  target || nodes.push({
    name,
    category,
    value: version,
  })
  for (const [pkgName, pkgVersion] of Object.entries(Object.assign(dependencies, devDependencies))) {
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
