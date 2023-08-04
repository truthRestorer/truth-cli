import { describe, expect, test } from 'vitest'
import { assign } from 'lib/utils/tools'
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
  test('tree is not empty', () => {
    expect(trees?.length).toBe(2)
  })
  test('remember tree children should be empty', () => {
    expect(trees[1]).toBeTruthy()
    expect(trees[1].children).toBeTruthy()
    expect(trees[1].children?.length).toBeFalsy()
  })
  test('tree should connected to relations', () => {
    const tree = trees[0]
    expect(relationsNames).contain(tree.name)
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i].children
      expect(relationsNames).toContain(tree.children[i].name)
      for (let j = 0; j < child?.length; j++)
        expect(relationsNames).toContain(child[i].name)
    }
  })
})
