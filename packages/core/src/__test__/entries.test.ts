import { describe, expect, test } from 'vitest'
import { useEntries } from '../json'

describe('readDir test', async () => {
  test('undefined or null should be empty Array', () => {
    expect(useEntries(undefined)).toEqual([])
  })
  test('basic test', () => {
    const result = useEntries({ a: 1, b: 2 })
    expect(result).toStrictEqual([['a', 1], ['b', 2]])
  })
})
