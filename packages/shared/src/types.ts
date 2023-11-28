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
  path?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  homepage?: string
}

export interface Relations {
  __root__: Relation
  __extra__: Record<string, Record<string, Relation>>
  [key: string]: Relation
}

export type Versions = Record<string, Record<string, string[]>>

export enum GraphDependency {
  DEPENDENCY,
  ROOT_DEPENDENCY,
  ROOT,
}
