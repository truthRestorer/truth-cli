import { describe, expect, test } from 'vitest'
import { genTxt } from '../txt'

describe('genTxt API 测试', () => {
  test('基本测试', () => {
    const txt = genTxt(2, {
      __extra__: {},
      __root__: {
        dependencies: {
          axios: '1.0.0',
          vue: '3.0.0',
          typescript: '5.0.0',
        },
        devDependencies: {
          vite: '3.0.0',
        },
      },
      axios: {
        dependencies: {
          vite: '2.0.0',
          rollup: '3.0.0',
        },
        devDependencies: {
          eslint: '7.0.0',
        },
      },
      vue: {
        dependencies: {
          '@vue/shared': '3.0.0',
          '@vue/complier-core': '3.0.0',
        },
      },
      typescript: {
        version: '5.0.0',
        dependencies: {
          typescript: '3.0.0',
        },
      },
      vite: {
        version: '3.0.0',
      },
    })
    expect(txt).includes(' ')
    expect(txt).includes('│')
    expect(txt).includes('├─')
    expect(txt).includes('\n')
    expect(txt).includes('__root__ latest')
    expect(txt).includes('axios 1.0.0')
    expect(txt).includes('vue 3.0.0')
    expect(txt).includes('rollup 3.0.0')
    expect(txt).includes('@vue/shared 3.0.0')
    expect(txt).includes('@vue/complier-core 3.0.0')
    expect(txt).includes('typescript 3.0.0')
    expect(txt).includes('vite 3.0.0')
    expect(txt).includes('typescript 5.0.0')
  })
})
