import { genGraph, genTree, genVersions } from '@truth-cli/core'

export async function initData() {
  const relationsJSON = await fetch('relations.json')
  const relations = await relationsJSON.json()
  const { nodes, links } = genGraph(relations)
  const tree = genTree(3, relations)

  const versions = genVersions(relations)
  return {
    nodes,
    links,
    tree,
    relations,
    versions,
  }
}
