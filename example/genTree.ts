/* eslint-disable no-console */
import { genTree } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 直接根据 relations 生成树：
const tree1 = genTree(2, relations)
console.log(tree1)

// 2. 自定义生成树：
const tree2 = genTree(2, {
  __extra__: {},
  __root__: {
    dependencies: {
      axios: '1.0.0',
      vue: '3.0',
      vite: '3.0.0',
    },
    version: '1.0.0',
  },
  axios: {
    version: '2.0.0',
    dependencies: {
      glob: '1.2.2',
      xxx: '1.0.2',
    },
    devDependencies: {
      vite: '3.0.0',
    },
  },
})

console.log(tree2)
