import type { Relation } from '@truth-cli/shared'

export interface PkgInfo {
  info?: Relation
  circulation?: string[]
  versions?: { [key: string]: string[] }
}

export type Legend = 'Tree' | 'Graph'

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
