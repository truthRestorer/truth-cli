import { describe, expect, test } from 'vitest'
import { useEntries } from '../json'

describe('useEntries 函数测试', async () => {
  test('undefined null', () => {
    expect(useEntries(undefined)).toEqual([])
  })
  test('有值的对象', () => {
    const result = useEntries({ a: 1, b: 2 })
    expect(result).toStrictEqual([['a', 1], ['b', 2]])
  })
})
