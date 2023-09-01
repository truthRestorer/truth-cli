import { describe, expect, test } from 'vitest'
import { genCirculation } from '../circulation'

describe('genCirculation API 测试', () => {
  test('基本测试', () => {
    const graph = genCirculation({
      __root__: {
        version: '1.0.0',
        dependencies: {
          axios: '0.0.1',
        },
        devDependencies: {
          'vue': '3.0.0',
          '@truth-cli/core': '1.0.0',
        },
      },
      axios: {
        devDependencies: {
          __root__: 'latest',
        },
      },
      vue: {
        devDependencies: {
          __root__: 'latest',
        },
      },
    })
    expect(graph).toEqual({
      __root__: ['axios', 'vue'],
      axios: ['__root__'],
      vue: ['__root__'],
    })
  })
})
