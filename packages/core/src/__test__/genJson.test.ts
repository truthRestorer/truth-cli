import { describe, expect, test } from 'vitest'
import { genJson } from '../json'

describe('genJson API 测试', () => {
  test('不进行深度优化', () => {
    const json = genJson(3, {
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
    expect(json).toEqual({
      name: '__root__',
      version: 'latest',
      packages: {
        axios: {
          version: '1.0.0',
          type: 1,
          packages: {
            vite: {
              version: '2.0.0',
              type: 1,
            },
            rollup: {
              version: '3.0.0',
              type: 1,
            },
            eslint: {
              version: '7.0.0',
              type: 0,
            },
          },
        },
        vue: {
          version: '3.0.0',
          type: 1,
          packages: {
            '@vue/shared': {
              version: '3.0.0',
              type: 1,
            },
            '@vue/complier-core': {
              version: '3.0.0',
              type: 1,
            },
          },
        },
        typescript: {
          type: 1,
          version: '5.0.0',
          packages: {
            typescript: {
              type: 1,
              version: '3.0.0',
            },
          },
        },
        vite: {
          type: 0,
          version: '3.0.0',
        },
      },
    })
  })

  test('进行深度优化', () => {
    const json = genJson(5, {
      __extra__: {},
      __root__: {
        dependencies: {
          axios: '1.0.0',
          vue: '3.0.0',
          typescript: '5.0.0',
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
        devDependencies: {
          typescript: '3.0.0',
        },
      },
    })
    expect(json).toEqual({
      name: '__root__',
      version: 'latest',
      packages: {
        axios: {
          version: '1.0.0',
          type: 1,
          packages: {
            vite: {
              version: '2.0.0',
              type: 1,
            },
            rollup: {
              version: '3.0.0',
              type: 1,
            },
            eslint: {
              version: '7.0.0',
              type: 0,
            },
          },
        },

        vue: {
          version: '3.0.0',
          type: 1,
          packages: {
            '@vue/shared': {
              version: '3.0.0',
              type: 1,
            },
            '@vue/complier-core': {
              version: '3.0.0',
              type: 1,
            },
          },
        },
        typescript: {
          type: 1,
          version: '5.0.0',
          packages: {
            typescript: {
              type: 0,
              version: '3.0.0',
            },
          },
        },
      },
    })
  })

  test('指定参数', () => {
    const json = genJson(3, {
      __extra__: {},
      __root__: {
        dependencies: {
          axios: '1.0.0',
          vue: '3.0.0',
          typescript: '5.0.0',
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
        devDependencies: {
          typescript: '3.0.0',
        },
      },
    }, true)
    expect(json).toEqual({
      name: '__root__',
      version: 'latest',
      packages: {
        axios: {
          version: '1.0.0',
          type: 1,
          packages: {
            vite: {
              version: '2.0.0',
              type: 1,
            },
            rollup: {
              version: '3.0.0',
              type: 1,
            },
            eslint: {
              version: '7.0.0',
              type: 0,
            },
          },
        },

        vue: {
          version: '3.0.0',
          type: 1,
          packages: {
            '@vue/shared': {
              version: '3.0.0',
              type: 1,
            },
            '@vue/complier-core': {
              version: '3.0.0',
              type: 1,
            },
          },
        },
        typescript: {
          type: 1,
          version: '5.0.0',
          packages: {
            typescript: {
              type: 0,
              version: '3.0.0',
            },
          },
        },
      },
    })
  })

  test('负数参数', () => {
    const json = genJson(-1, {
      __extra__: {},
      __root__: {
        dependencies: {
          axios: '1.0.0',
          vue: '3.0.0',
          typescript: '5.0.0',
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
        devDependencies: {
          typescript: '3.0.0',
        },
      },
    }, true)
    expect(json).toEqual({
      name: '__root__',
      version: 'latest',
      packages: {
        axios: {
          version: '1.0.0',
          type: 1,
        },
        vue: {
          version: '3.0.0',
          type: 1,
        },
        typescript: {
          type: 1,
          version: '5.0.0',
        },
      },
    })
  })
})
