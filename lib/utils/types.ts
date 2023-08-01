export interface INodes {
  name: string
  category: number | null
  value: string
  symbolSize: number | null
}

export interface ILinks {
  relation?: INodes
  source: string
  target: string
}

interface ICategories {
  name: 'dependency' | 'devDependency' | 'root'
}

export const categories: ICategories[] = [
  {
    name: 'dependency',
  },
  {
    name: 'devDependency',
  },
  {
    name: 'root',
  },
]

interface IRelationRepository {
  type: string
  url: string
  [key: string]: string
}

export interface IRelations {
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

export enum EDep {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}

// FIXME: TS 没学好，这里类型用 any
export interface IPkgs {
  [key: string]: any
}
