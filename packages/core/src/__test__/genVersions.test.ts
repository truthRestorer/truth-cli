import { describe, expect, test } from 'vitest'
import { genVersions } from '../versions'

describe('genVersions API 测试', () => {
  test('基本测试', () => {
    const versions = genVersions({
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
    expect(versions).toEqual({
      axios: {
        '1.0.0': ['__root__'],
      },
      rollup: {
        '2.0.0': ['__root__', 'axios'],
      },
    })
  })
})
