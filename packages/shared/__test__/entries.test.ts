import { describe, expect, test } from 'vitest'
import { entries } from '@truth-cli/shared'

describe('readDir test', async () => {
  test('undefined or null should be empty Array', () => {
    expect(entries(undefined)).toEqual([])
  })
  test('basic test', () => {
    const result = entries({ a: 1, b: 2 })
    expect(result).toStrictEqual([['a', 1], ['b', 2]])
  })
})
