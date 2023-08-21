import type { Relation } from '@truth-cli/shared'

export interface PkgInfo {
  __info__?: Relation
  __circulation__?: string[]
  __versions__?: { [key: string]: string[] }
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
