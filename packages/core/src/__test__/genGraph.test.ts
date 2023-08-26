import { describe, expect, test } from 'vitest'
import { genGraph } from '../graph'

describe('genGraph API 测试', () => {
  test('不指定 name 字段和 target 参数', () => {
    const graph = genGraph({
      dependencies: {
        axios: '1.0.0',
        vue: '3.0.0',
      },
    })
    expect(graph).toEqual({
      nodes: [
        { name: '__root__', value: 'latest', category: 2 },
        { name: 'axios', value: '1.0.0', category: 1 },
        { name: 'vue', value: '3.0.0', category: 1 },
      ],
      links: [
        { source: 'axios', target: '__root__' },
        { source: 'vue', target: '__root__' },
      ],
    })
  })

  test('指定 name 字段', () => {
    const graph = genGraph({
      name: 'vite',
      dependencies: {
        axios: '1.0.0',
        vue: '3.0.0',
      },
    })
    expect(graph).toEqual({
      nodes: [
        { name: 'vite', value: 'latest', category: 2 },
        { name: 'axios', value: '1.0.0', category: 1 },
        { name: 'vue', value: '3.0.0', category: 1 },
      ],
      links: [
        { source: 'axios', target: 'vite' },
        { source: 'vue', target: 'vite' },
      ],
    })
  })

  test('指定 target 字段', () => {
    const graph = genGraph({
      dependencies: {
        axios: '1.0.0',
        vue: '3.0.0',
      },
    }, 'vite')
    expect(graph).toEqual({
      nodes: [
        { name: 'axios', value: '1.0.0', category: 1 },
        { name: 'vue', value: '3.0.0', category: 1 },
      ],
      links: [
        { source: 'axios', target: 'vite' },
        { source: 'vue', target: 'vite' },
      ],
    })
  })

  test('指定 name 字段和 target 参数', () => {
    const graph = genGraph({
      name: 'vite',
      dependencies: {
        axios: '1.0.0',
        vue: '3.0.0',
      },
    }, 'rollup')
    expect(graph).toEqual({
      nodes: [
        { name: 'vite', value: 'latest', category: 2 },
        { name: 'axios', value: '1.0.0', category: 1 },
        { name: 'vue', value: '3.0.0', category: 1 },
      ],
      links: [
        { source: 'axios', target: 'rollup' },
        { source: 'vue', target: 'rollup' },
      ],
    })
  })

  test('指定 category 参数', () => {
    const graph = genGraph({
      dependencies: {
        axios: '1.0.0',
        vue: '3.0.0',
      },
    }, 'vite', 0)
    expect(graph).toEqual({
      nodes: [
        { name: 'axios', value: '1.0.0', category: 0 },
        { name: 'vue', value: '3.0.0', category: 0 },
      ],
      links: [
        { source: 'axios', target: 'vite' },
        { source: 'vue', target: 'vite' },
      ],
    })
  })
})
