import { genCirculation, genTree, genVersions } from '@truth-cli/core'

globalThis.addEventListener('message', async () => {
  const relationsJSON = await fetch('http://localhost:3003/relations.json')
  const relations = await relationsJSON.json()

  globalThis.postMessage({
    relations,
    tree: genTree(1, relations),
    versions: genVersions(relations),
    circulation: genCirculation(relations),
  })
})
