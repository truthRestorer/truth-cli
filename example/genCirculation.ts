/* eslint-disable no-console */
import { genCirculation } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 通过获取所有依赖的循环依赖
const circulation1 = genCirculation(relations)
console.log(circulation1)

// 2. 自定义生成，默认生成的 links 会指向 __root__
const circulation2 = genCirculation({
  __extra__: {},
  __root__: {
    dependencies: {
      axios: '1.0.0',
    },
  },
  axios: {
    dependencies: {
      __root__: 'latest',
    },
  },
})
console.log(circulation2)
