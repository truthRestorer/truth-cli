import { describe, expect, test } from 'vitest'
import { genTxt } from '../txt'

describe('genTxt API 测试', () => {
  test('基本测试', () => {
    const txt = genTxt(0, {
      __extra__: {},
      __root__: {
        name: 'truth-cli',
        dependencies: {
          axios: '1.0.0',
          rollup: '2.0.0',
        },
      },
      axios: {
        name: 'axios',
        dependencies: {
          rollup: '2.0.0',
        },
      },
    })
    expect(txt).includes(' ')
    expect(txt).includes('│')
    expect(txt).includes('├─')
    expect(txt).includes('\n')
    expect(txt).includes('__root__ latest')
    expect(txt).includes('axios 1.0.0')
    expect(txt).includes('rollup 2.0.0')
    expect(txt).includes('__root__ latest')
  })
})
