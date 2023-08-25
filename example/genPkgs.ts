/* eslint-disable no-console */
import { genJson } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 直接根据 relations 生成：
const pkgTree1 = genJson(1, relations)
console.log(pkgTree1)

// 2. 自定义生成：
const pkgTree2 = genJson(1, {
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
console.log(pkgTree2)

// 3. 采取深度优化：
const pkgTree3 = genJson(1, relations, true)
console.log(pkgTree3)
