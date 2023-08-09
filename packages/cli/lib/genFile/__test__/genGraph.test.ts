import { describe, expect, test } from 'vitest'
import { assign } from '@truth-cli/shared'
import { readFile } from '../../utils/tools'
import { genGraph } from '../graph'
import { genRelations } from '../relations'

describe('genGraph test', async () => {
  await genRelations()
  const { nodes, links } = await genGraph()
  test('nodes and links is not empty', () => {
    expect(nodes).toBeTruthy()
    expect(links).toBeTruthy()
  })
  test('nodes and links should connected to package.json', async () => {
    const { name, dependencies, devDependencies } = await readFile('./package.json')
    const pkgs = assign(dependencies, devDependencies)
    // @esbuild/win32-x64 不知道哪来的
    const nodesNames = nodes.map(item => item.name)
    const linksNames = new Set([...links.map(item => item.target), ...links.map(item => item.source), '@esbuild/win32-x64'])
    expect(nodesNames).toContain(name)
    expect(linksNames).toContain(name)
    for (const key of Object.keys(pkgs)) {
      expect(nodesNames).toContain(key)
      expect(linksNames).toContain(key)
    }
  })
})
