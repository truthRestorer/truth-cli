export async function initData() {
  const graph = await fetch('graph.json')
  const { nodes, links } = await graph.json()
  const treeJSON = await fetch('tree.json')
  const tree = await treeJSON.json()
  const relationsJSON = await fetch('relations.json')
  const relations = await relationsJSON.json()
  const versionsJSON = await fetch('versions.json')
  const versions = await versionsJSON.json()
  return {
    nodes,
    links,
    tree,
    relations,
    versions,
  }
}
