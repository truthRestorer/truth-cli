import { describe, expect, expectTypeOf, test } from 'vitest'
import { useReadDir } from '@truth-cli/shared'

describe('readDir test', () => {
  const result = useReadDir('packages')
  test('result should be Array', () => {
    expectTypeOf(result).toBeArray()
  })
  test('result should only have web and docs', () => {
    expect(result).toEqual(['cli', 'core', 'shared', 'web'])
  })
})
