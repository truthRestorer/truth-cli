# API 指南

::: tip 首先说明
`truth-cli` 只是一个命令行工具，提供 api 的依赖是 `@truth-cli/core`。

注：`@truth-cli/core` 运行的函数有 node 和浏览器环境之分，`genRelations` 只能运行在 node 环境，其他 API 可以运行在 node 和浏览器环境中
:::

如果你想更好的使用 `@truth-cli/core` 的 API，可以查看我们的 [Playground](https://truth-cli-playground.vercel.app/) 各个 API 返回值。

## 安装

::: code-group
```bash [npm]
npm install @truth-cli/core
```
```bash [yarn]
yarn add @truth-cli/core
```
```bash [pnpm]
pnpm add @truth-cli/core
```
:::

## genRelations

::: tip API 介绍
`genRelations` 用于生成 `relations` 数据。**由于需要读取文件，所以这是一个 node 环境下的 API，客户端无法调用，这也是 `@truth-cli/core` 唯一一个 noed 环境 API**
:::

```ts
import { genRelations } from '@truth-cli/core/node'

function genRelations(): Relations

interface Relation {
  version?: string
  dependencies?: { [key: string]: string }
  devDependencies?: { [key: string]: string }
  homepage?: string
  [key: string]: any
}

interface Relations {
  __root__: Relation
  [key: string]: Relation
}
```

> 你可以将 `relations` 数据看作是所有依赖的 `package.json` 的合集

## genGraph

::: tip 功能介绍
`genGraph` 用于生成 `echarts` 中 `graph` 图所需要的数据
:::

```ts
import { genGraph } from '@truth-cli/core'

function genGraph(relation: Relation, target?: string, category?: GraphDependency): {
  nodes: Nodes[]
  links: Links[]
}

enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}

interface Nodes {
  name: string
  category: number
  value: string
  symbolSize?: number
}

interface Links {
  source: string
  target: string
}
```

### 具体使用

你可以将某个 `package.json` 文件的内容当作参数传入，如果 `package.json` 中不存在 `name` 字段，同时你也未指定 `target`，那么返回的 `links` 数据会指向 `__root__`

第三个参数表示 `package.json` 的类型，默认为 `GraphDependency.ROOT`

```ts
// 1. 不带 target 和 name 字段
const graph1 = genGraph({
  dependencies: {
    vue: '3.0.0',
  },
})
console.log(graph1)
/*
输出：
{
  nodes: [
    { name: '__root__', category: 2, value: 'latest' },
    { name: 'vue', category: 1, value: '3.0.0' }
  ],
  links: [ { source: 'vue', target: '__root__' } ]
}
*/
// 2. 带有 name 字段
const graph2 = genGraph({
  name: 'vite',
  dependencies: {
    axios: '1.0.0',
  },
})
console.log(graph2)
/*
{
  nodes: [
    { name: 'vite', category: 2, value: 'latest' },
    { name: 'vue', category: 1, value: '3.0.0' }
  ],
  links: [ { source: 'vue', target: 'vite' } ]
}
*/
// 3. 与 2 等同
const graph3 = genGraph({
  dependencies: {
    axios: '1.0.0',
  },
}, 'vite')
console.log(graph3)
```

## genTree

::: tip 功能介绍
`genTree` API 用于生成 `echarts` 中 `tree` 图所需要的数据
:::

```ts
import { genTree } from '@truth-cli/core'

declare function genTxt(depth: number, relations: Relations): string

interface Tree {
  name: string
  value: string
  children: Tree[]
  collapsed?: boolean
}
```

## genVersions

::: tip 功能介绍
`genVersions` 用于生成同一个依赖的多个版本数据
:::

```ts
import { genVersions } from '@truth-cli/core'

function genVersions(relations: Relations): Versions

interface IVersions {
  [key: string]: {
    [key: string]: string[]
  }
}
```

## genJson

::: tip 功能介绍
`genJson` API 用于生成 `pkgs.json` 文件数据
:::

第三个参数表示是否采取优化措施

```ts
import { genJson } from '@truth-cli/core'

declare function genJson(depth: number, relations: Relations, shouldOptimize?: boolean): Pkgs

interface Pkgs {
  version: string
  type?: PkgDependency
  packages?: Pkgs
  [key: string]: any
}
```

## genTxt

::: tip 功能介绍
`genTxt` API 用于生成树形结构的文本数据，在根目录中生成 `pkgs.txt`
:::

```ts
import { genTxt } from '@truth-cli/core'

declare function genTxt(depth: number, relations: Relations): string
```