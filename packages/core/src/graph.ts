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
    dependencies = {},
    devDependencies,
  } = relation
  const links: Links[] = []
  const nodes: Nodes[] = []
  if (!target || name !== '__root__') {
    nodes.push({
      name,
      category: GraphDependency.ROOT,
      value: version,
    })
  }
  for (const [pkgName, pkgVersion] of Object.entries(Object.assign(dependencies, devDependencies))) {
    nodes.push({
      name: pkgName,
      category: category ?? GraphDependency.ROOT_DEPENDENCY,
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
