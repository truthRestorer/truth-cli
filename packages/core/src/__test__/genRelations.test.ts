import { describe, expect, expectTypeOf, test } from 'vitest'
import { isEmptyObj } from '@truth-cli/shared'
import { genRelations } from '../relations'

describe('genRelations API 测试', async () => {
  const result = genRelations()
  const relations = genRelations()
  test('数据格式', () => {
    expectTypeOf(result).toBeObject()
    expectTypeOf(result).toBeObject()
    expectTypeOf(relations).toBeObject()
    expect(isEmptyObj(result)).toBeFalsy()
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(relations.__root__)).toBeFalsy()
  })
  test('属性及属性值', () => {
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(relations.__root__)).toBeFalsy()
    for (const [key, val] of Object.entries(relations)) {
      if (key === '__extra__')
        continue
      expect(val).ownProperty('version')
    }
    expect(relations.__root__).ownProperty('version')
    expect(relations.__root__).ownProperty('devDependencies')
  })
})
