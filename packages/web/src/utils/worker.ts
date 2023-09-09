import { genCirculation, genTree, genVersions } from '@truth-cli/core'
import type { Relations } from '@truth-cli/shared'

globalThis.addEventListener('message', async (e) => {
  let relations: Relations
  if (Object.keys(e.data).length > 2) {
    relations = e.data
  }
  else {
    const relationsJSON = await fetch('http://localhost:3003/relations.json')
    relations = await relationsJSON.json()
  }

  globalThis.postMessage({
    relations,
    tree: genTree(1, relations),
    versions: genVersions(relations),
    circulation: genCirculation(relations),
  })
})
