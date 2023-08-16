
import { genGraph } from '@truth-cli/core'

// 利用类似 relations 的结构生成 graph，你也可以直接将 relations 传入
const graph = genGraph({
  __root__: {
    version: '0.0.1',
    dependencies: {
      axios: '1.0.0',
      vue: '3.0.0'
    },
    homepage: ''
  },
  __extra__: {}
})

console.log(graph)