import { describe, expect, test } from 'vitest'
import { assign } from '@truth-cli/shared'
import { genTree } from '../tree'
import { genRelations } from '../relations'

describe('genTree test', async () => {
  const relations = await genRelations()
  const relationsNames = new Set([
    ...Object.keys(relations),
    ...Object.values(relations).map((item: any) => {
      const deps = assign(item.devDependencies, item.dependencies)
      return Object.keys(deps)
    }).flat(),
  ])
  const trees: any = await genTree(0)
  test('tree and tree children should be empty', () => {
    expect(trees).toBeTruthy()
    expect(trees.children?.length).toBeTruthy()
  })
  test('tree should connected to relations', () => {
    expect(relationsNames).contain('__root__')
    for (let i = 0; i < trees.children.length; i++) {
      const child = trees.children[i]
      expect(relationsNames).toContain(child.name)
    }
  })
})
