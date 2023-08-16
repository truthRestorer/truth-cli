import { describe, expect, test } from 'vitest'
import { useReadFile } from '@truth-cli/shared'

describe('readFile test', () => {
  const result = useReadFile('package.json')
  test('result should be object', () => {
    expect(result).toBeTypeOf('object')
  })
  test('result should have devDependencies, dependencies and scripts property', async () => {
    expect(result.devDependencies).toBeTypeOf('object')
    expect(result.dependencies).toBeTypeOf('undefined')
    expect(result.scripts).toBeTypeOf('object')
  })
})
