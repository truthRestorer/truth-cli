import { describe, expect, expectTypeOf, test } from 'vitest'
import { isEmptyObj } from '@truth-cli/shared'
import { genRelations } from '../relations'

describe('genRelations test', async () => {
  const result = await genRelations()
  const { relations } = await import('../relations')
  test('export data should have corret type and it is not empty', () => {
    expectTypeOf(result).toBeObject()
    expectTypeOf(result).toBeObject()
    expectTypeOf(relations).toBeObject()
    expect(isEmptyObj(result)).toBeFalsy()
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(relations.__root__)).toBeFalsy()
  })
  test('export data have their own props', () => {
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(relations.__root__)).toBeFalsy()
    for (const val of Object.values(relations)) {
      expect(val).ownProperty('name')
      expect(val).ownProperty('description')
      expect(val).ownProperty('version')
      expect(val).ownProperty('homepage')
      expect(val).ownProperty('repository')
      expect(val).ownProperty('author')
    }
    expect(relations.__root__).ownProperty('name')
    expect(relations.__root__).ownProperty('version')
  })
})
