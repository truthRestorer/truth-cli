import { expect, test } from 'vitest'
import { useReadFile } from '../relations'
import pkgJson from '../../../../package.json'

test('readFile API 测试', () => {
  const result = useReadFile('package.json')
  expect(result).toEqual(pkgJson)
})
