import { describe, expect, test } from 'vitest'
import { useAssign } from '@truth-cli/shared'
import { genGraph } from '../graph'
import { genRelations, useReadFile } from '../relations'

describe('genGraph test', () => {
  const relations = genRelations()
  const { nodes, links } = genGraph(relations.__root__)
  test('nodes and links is not empty', () => {
    expect(nodes).toBeTruthy()
    expect(links).toBeTruthy()
  })
  test('nodes and links should connected to package.json', async () => {
    const { name, dependencies, devDependencies } = useReadFile('package.json')
    const pkgs = useAssign(dependencies, devDependencies)
    const nodesNames = nodes.map(item => item.name)
    const linksNames = new Set([...links.map(item => item.target), ...links.map(item => item.source)])
    expect(nodesNames).toContain(name ?? '__root__')
    for (const key of Object.keys(pkgs)) {
      expect(nodesNames).toContain(key)
      expect(linksNames).toContain(key)
    }
  })
})
