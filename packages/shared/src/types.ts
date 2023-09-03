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
  name?: string
  version?: string
  dependencies?: { [key: string]: string }
  devDependencies?: { [key: string]: string }
  homepage?: string
}

export interface Relations {
  __root__: Relation
  __extra__: {
    [key: string]: Relation[]
  }
  [key: string]: Relation
}

export interface Versions {
  [key: string]: {
    [key: string]: string[]
  }
}
