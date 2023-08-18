import { describe, expect, test } from 'vitest'
import { useAssign } from '../tools'

describe('assign function', () => {
  const result = useAssign({ a: 1 }, { b: 2 })
  test('result should be object', () => {
    expect(result).toBeTypeOf('object')
  })
  test('result should be { a: 1, b: 2 }', () => {
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
