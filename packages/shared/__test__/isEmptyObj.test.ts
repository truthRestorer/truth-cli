import { describe, expect, test } from 'vitest'
import { isEmptyObj } from 'packages/shared'

describe('isEmptyObj function', () => {
  test('undefined or null should be truthy', () => {
    expect(isEmptyObj(undefined)).toBeTruthy()
    expect(isEmptyObj(null)).toBeTruthy()
  })
  test('{} should be truthy', () => {
    expect(isEmptyObj({})).toBeTruthy()
  })
  test('basic test', () => {
    const t: { [key: string]: any } = { a: 1, b: 3 }
    expect(isEmptyObj(t)).toBeFalsy()
    delete t.a
    expect(isEmptyObj(t)).toBeFalsy()
    delete t.b
    expect(isEmptyObj(t)).toBeTruthy()
  })
})
