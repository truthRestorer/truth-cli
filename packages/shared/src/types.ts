export interface INodes {
  name: string
  category: number
  value: string
  symbolSize?: number
}

export interface ILinks {
  source: string
  target: string
}

export enum EDeps {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}
export interface ITree {
  name: string
  value: string
  children?: ITree[]
}

export interface IRelation {
  version: string
  dependencies: { [key: string]: string }
  devDependencies: { [key: string]: string }
  homepage: string
  [key: string]: any
}
export interface IRelations {
  [key: string]: IRelation | Partial<IRelation>
}

export enum EDep {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}

export interface IPkgs {
  version: string
  type: EDep
  packages: IPkgs
  [key: string]: any
}

export interface IVersions {
  [key: string]: {
    [key: string]: string[]
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
  dep: number
  isBoth?: boolean
  isBuild?: boolean
  writePath?: string
}

export interface IContext {
  source: string
  push: (symbol: string) => void
  removeLastElm: () => string
  dealNewLine: (tabCount: number, shouldAdd?: boolean) => void
  dealEnd: () => void
}
