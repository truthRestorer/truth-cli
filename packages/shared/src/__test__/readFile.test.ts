import { describe, expect, test } from 'vitest'
import { readFile } from '@truth-cli/shared'

describe('readFile test', async () => {
  const result = await readFile('package.json')
  test('result should be object', () => {
    expect(result).toBeTypeOf('object')
  })
  test('result should have devDependencies, dependencies and scripts property', async () => {
    expect(result.devDependencies).toBeTypeOf('object')
    expect(result.dependencies).toBeTypeOf('undefined')
    expect(result.scripts).toBeTypeOf('object')
  })
})
