import { describe, expect, expectTypeOf, test } from 'vitest'
import { assign, isEmptyObj } from '@truth-cli/shared'
import { genRelations } from '../relations'

describe('genRelations test', async () => {
  const result = await genRelations()
  const { relations, rootPkg, rootPkgSet } = await import('../relations')
  test('export data should have corret type and it is not empty', () => {
    expectTypeOf(result).toBeObject()
    expectTypeOf(result).toBeObject()
    expectTypeOf(relations).toBeObject()
    expectTypeOf([...rootPkgSet]).toBeArray()
    expect(isEmptyObj(result)).toBeFalsy()
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(rootPkg.__root__)).toBeFalsy()
    expect(rootPkgSet.size).toBeGreaterThan(0)
  })
  test('export data have their own props', () => {
    expect(isEmptyObj(relations)).toBeFalsy()
    expect(isEmptyObj(rootPkg.__root__)).toBeFalsy()
    expect(rootPkgSet).toBeTruthy()
    for (const val of Object.values(relations)) {
      expect(val).ownProperty('name')
      expect(val).ownProperty('description')
      expect(val).ownProperty('version')
      expect(val).ownProperty('homepage')
      expect(val).ownProperty('repository')
      expect(val).ownProperty('author')
    }
    const { devDependencies, dependencies } = rootPkg.__root__
    expect(rootPkg.__root__).ownProperty('name')
    expect(rootPkg.__root__).ownProperty('version')
    for (const key of Object.keys(assign(devDependencies, dependencies)))
      expect([...rootPkgSet]).toContain(key)
  })
})
