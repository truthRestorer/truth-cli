import { describe, expect, test } from 'vitest'
import { genTree } from '../tree'

describe('genTree API 测试', () => {
  test('depth 小于 1', () => {
    const tree = genTree(0, {
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
    expect(tree).toEqual({
      name: 'truth-cli',
      value: 'latest',
      children: [
        { name: 'axios', value: '1.0.0', children: [] },
        { name: 'rollup', value: '2.0.0', children: [] },
      ],
    })
  })

  test('depth 等于 1', () => {
    const tree = genTree(1, {
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
    expect(tree).toEqual({
      name: 'truth-cli',
      value: 'latest',
      children: [
        {
          name: 'axios',
          value: '1.0.0',
          children: [],
        },
        {
          name: 'rollup',
          value: '2.0.0',
          children: [],
        },
      ],
    })
  })

  test('depth 大于 1', () => {
    const tree = genTree(2, {
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
    expect(tree).toEqual({
      name: 'truth-cli',
      value: 'latest',
      children: [
        {
          name: 'axios',
          value: '1.0.0',
          children: [
            { name: 'rollup', value: '2.0.0', children: [] },
          ],
        },
        {
          name: 'rollup',
          value: '2.0.0',
          children: [],
        },
      ],
    })
  })
})
