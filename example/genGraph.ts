/* eslint-disable no-console */
import { genGraph } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 直接根据 relations 生成：
const graph1 = genGraph(relations)
console.log(graph1)

// 2. 自定义生成：
const graph2 = genGraph({
  __root__: {
    version: '0.0.1',
    dependencies: {
      axios: '1.0.0',
      vue: '3.0.0',
    },
    homepage: '',
  },
  __extra__: {},
})
console.log(graph2)
