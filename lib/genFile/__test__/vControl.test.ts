import { describe, expect, test } from 'vitest'
import { vControl } from '../versions'

describe('vControl test', async () => {
  test('basic test', () => {
    expect(vControl('^1.0.0')).toBe('^1')
    expect(vControl('^10.0.0')).toBe('^10')
    expect(vControl('~1.0.0')).toBe('~1.0')
    expect(vControl('~10.0.0')).toBe('~10.0')
    expect(vControl('~10.2.*')).toBe('~10.2')
    expect(vControl('10.0.0')).toBe('10.0.0')
    expect(vControl('~10.0.0')).toBe('~10.0')
    expect(vControl('1.0.0')).toBe('1.0.0')
    expect(vControl('*')).toBe('*')
    expect(vControl('1.0.x')).toBe('1.0.x')
    expect(vControl('>=1')).toBe('>=1')
  })
})
