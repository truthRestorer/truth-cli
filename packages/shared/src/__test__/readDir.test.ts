import { describe, expect, expectTypeOf, test } from 'vitest'
import { readDir } from '@truth-cli/shared'

describe('readDir test', async () => {
  const result = await readDir('packages')
  test('result should be Array', () => {
    expectTypeOf(result).toBeArray()
  })
  test('result should only have web and docs', () => {
    expect(result).toEqual(['cli', 'core', 'shared', 'web'])
  })
})
