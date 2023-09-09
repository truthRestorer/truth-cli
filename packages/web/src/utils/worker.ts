import { genCirculation, genTree, genVersions } from '@truth-cli/core'
import type { Relations } from '@truth-cli/shared'

globalThis.addEventListener('message', async (e) => {
  const relations: Relations = e.data
  globalThis.postMessage({
    relations,
    tree: genTree(1, relations),
    versions: genVersions(relations),
    circulation: genCirculation(relations),
  })

  globalThis.close()
})
