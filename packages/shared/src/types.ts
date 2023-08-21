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

export interface Tree {
  name: string
  value: string
  children: Tree[]
  collapsed?: boolean
}

export interface Relation {
  version?: string
  dependencies?: { [key: string]: string }
  devDependencies?: { [key: string]: string }
  homepage?: string
  [key: string]: any
}

export interface Relations {
  __root__: Relation
  [key: string]: Relation
}

export interface Versions {
  [key: string]: {
    [key: string]: string[] | string
  }
}
