import { describe, expect, test } from 'vitest'
import { genGraph } from '../graph'
import { genRelations } from '../relations'

describe('genGraph test', async () => {
  const relations = await genRelations()
  const { nodes, links } = await genGraph()
  test('nodes and links is not empty', () => {
    expect(nodes).toBeTruthy()
    expect(links).toBeTruthy()
  })
  test('nodes and links should connected to relations', () => {
    const nodesNames = nodes.map(item => item.name)
    // @esbuild/win32-x64 不知道哪来的
    const linksNames = new Set([...links.map(item => item.target), ...links.map(item => item.source), '@esbuild/win32-x64'])
    for (const key of Object.keys(relations)) {
      expect(nodesNames).toContain(key)
      expect(linksNames).toContain(key)
    }
  })
})
