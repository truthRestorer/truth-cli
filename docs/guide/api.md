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

function genGraph(relation: Relation, target?: string): {
  nodes: Nodes[]
  links: Links[]
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

## genTree

::: tip 功能介绍
`genTree` API 用于生成 `echarts` 中 `tree` 图所需要的数据
:::

```ts
import { genTree } from '@truth-cli/core'

declare function genPkgTree(depth: number, relations: Relations, shouldOptimize?: boolean): string

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

## genPkgs

::: tip 功能介绍
`genPkgs` API 用于生成 `pkgs.json` 文件数据
:::

```ts
import { genPkgs } from '@truth-cli/core'

declare function genPkgs(depth: number, relations: Relations, shouldOptimize?: boolean): Pkgs

interface Pkgs {
  version: string
  type?: PkgDependency
  packages?: Pkgs
  [key: string]: any
}
```

## genPkgTree

::: tip 功能介绍
`genPkgTree` API 用于生成树形结构的文本数据，在根目录中生成 `pkgs.txt`
:::

```ts
import { genPkgTree } from '@truth-cli/core'

declare function genPkgTree(depth: number, relations: Relations, shouldOptimize?: boolean): string
```