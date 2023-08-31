import { genCirculation, genTree, genVersions } from '@truth-cli/core'
import type { Relations } from '@truth-cli/shared'

globalThis.addEventListener('message', (e) => {
  const relations: Relations = e.data
  globalThis.postMessage({
    tree: genTree(1, relations),
    versions: genVersions(relations),
    circulation: genCirculation(relations),
  })
})
