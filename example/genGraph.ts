/* eslint-disable no-console */
import { genGraph } from '@truth-cli/core'
import { relations } from './index.js'

// 1. 直接根据 relations 生成：
const graph1 = genGraph(relations)
console.log(graph1)

// 2. 自定义生成，默认生成的 links 会指向 __root__
const graph2 = genGraph({
  version: '0.0.1',
  dependencies: {
    axios: '1.0.0',
    vue: '3.0.0',
  },
  homepage: '',
})
console.log(graph2)

// 3. 自定义生成，指定此 links 指向自定义 target(函数的第二个参数)

const graph3 = genGraph({
  version: '0.0.1',
  dependencies: {
    axios: '1.0.0',
    vue: '3.0.0',
  },
  homepage: '',
}, 'vite')
console.log(graph3)

// 自定义生成出的 nodes 可能会和之前的 nodes 重复，如果希望手动添加节点，建议使用 Set 数据结构判断一下节点是否已经存在
const { nodes } = graph2
const nodesSet = new Set(nodes.map(item => item.name))
for (let i = 0; i < nodes.length; i++) {
  // 只有节点不存在的时候，才会向 graph3 中添加节点
  if (!nodesSet.has(nodes[i].name))
    graph3.nodes.push(nodes[i])
}
