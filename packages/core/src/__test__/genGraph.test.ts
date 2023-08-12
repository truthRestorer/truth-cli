import { describe, expect, test } from 'vitest'
import { assign, readFile } from '@truth-cli/shared'
import { genGraph } from '../graph'
import { genRelations } from '../relations'

describe('genGraph test', () => {
  genRelations()
  const { nodes, links } = genGraph()
  test('nodes and links is not empty', () => {
    expect(nodes).toBeTruthy()
    expect(links).toBeTruthy()
  })
  test('nodes and links should connected to package.json', async () => {
    const { name, dependencies, devDependencies } = await readFile('./package.json')
    const pkgs = assign(dependencies, devDependencies)
    const nodesNames = nodes.map(item => item.name)
    const linksNames = new Set([...links.map(item => item.target), ...links.map(item => item.source)])
    expect(nodesNames).toContain(name ?? '_root_')
    for (const key of Object.keys(pkgs)) {
      expect(nodesNames).toContain(key)
      expect(linksNames).toContain(key)
    }
  })
})
