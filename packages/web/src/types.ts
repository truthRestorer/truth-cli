import type { Relation } from 'packages/shared'

export type Legend = 'Tree' | 'Graph'

export interface PkgInfo {
  info?: Relation
  circulation?: string[]
  versions?: { [key: string]: string[] }
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
