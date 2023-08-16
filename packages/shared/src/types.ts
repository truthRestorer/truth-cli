export interface Nodes {
  name: string
  category: number
  value: string
  symbolSize?: number
}

export interface Links {
  source: string
  target: string
}

export enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}
export interface Tree {
  name: string
  value: string
  children?: Tree[]
}

export interface Relation {
  version: string
  dependencies?: { [key: string]: string }
  devDependencies?: { [key: string]: string }
  homepage: string
  [key: string]: any
}

interface Extra extends Relation {
  related: string
}
export interface Relations {
  __extra__: Partial<{ [key: string]: Extra }>
  __root__: Relation
  [key: string]: Relation | Partial<Relation>
}

export enum PkgDependency {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}

export interface Pkgs {
  version: string
  type: PkgDependency
  packages?: Pkgs
  [key: string]: any
}

export interface Versions {
  [key: string]: {
    [key: string]: string[] | string
  }
}

export const categories = [
  {
    name: '依赖',
  },
  {
    name: '项目依赖',
  },
  {
    name: '项目名',
  },
]

export interface IOptions {
  isBoth?: boolean
  isVercelBuildOrDev?: boolean
  writePath?: string
}

export interface IContext {
  source: string
  push: (symbol: string) => void
  removeLastElm: () => string
  dealNewLine: (tabCount: number, shouldAdd?: boolean) => void
  dealEnd: () => void
}
