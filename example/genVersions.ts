import { genVersions } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 直接根据 relations 生成：
const versions1 = genVersions(relations)
console.log(versions1)

// 2. 自定义生成：
const versions2 = genVersions({
  __root__: {
    dependencies: {
      axios: '1.0.0',
      vue: '3.0',
      vite: '3.0.0',
    },
    version: '1.0.0',
  },
  __extra__: {},
  axios: {
    version: '2.0.0',
    dependencies: {
      glob: '1.2.2',
      xxx: '1.0.2'
    },
    devDependencies: {
      vite: '3.0.0'
    }
  }
})

console.log(versions2)
