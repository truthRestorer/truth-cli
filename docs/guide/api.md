# API 指南

::: tip 首先说明
`truth-cli` 只是一个命令行工具，提供 api 的依赖是 `@truth-cli/core`
:::

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
`genRelations` 用于生成 `relations` 数据；**后续 API 都需要先调用 `genRelations` 函数**
:::

```ts
function genRelations(): Partial<IRelations>

interface IRelationRepository {
  type: string
  url: string
  [key: string]: string
}

interface IRelations {
  name: string
  description: string
  version: string
  dependencies: { [key: string]: string }
  devDependencies: { [key: string]: string }
  repository: IRelationRepository[]
  author: string
  homepage: string
  [key: string]: any
}
```

> 你可以将 `relations` 数据看作是所有依赖的 `package.json` 的合集

## genGraph

::: tip 功能介绍
`genGraph` 用于生成 `echarts` 中 `graph` 图所需要的数据
:::

```ts
declare function genGraph(): {
  nodes: INodes[]
  links: ILinks[]
}

interface INodes {
  name: string
  category: number
  value: string
  symbolSize?: number
}

interface ILinks {
  source: string
  target: string
  v: string
}
```

## genTree

::: tip 功能介绍
`genTree` API 用于生成 `echarts` 中 `tree` 图所需要的数据
:::

```ts
declare function genTree(maxDep: number): ITree
interface ITree {
  name: string
  value: string
  children?: ITree[]
}
```

## genVersions

::: tip 功能介绍
`genVersions` 用于生成同一个依赖的多个版本数据
:::

```ts
declare function genVersions(): IVersions
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
declare function genPkgs(depth: number): IPkgs

interface IPkgs {
  name: string
  version: string
  type: EDep
  packages: IPkgs
  [key: string]: any
}
```

## genPkgTree

::: tip 功能介绍
`genPkgTree` API 用于生成树形结构的文本数据，在根目录中生成 `treePkgs.txt`
:::

```ts
declare function genPkgTree(maxDep: number): string
```