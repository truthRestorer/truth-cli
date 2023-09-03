import type { Relation } from 'packages/shared'

export type Legend = 'Tree' | 'Graph'

export type ShowType = 'info' | 'circulation' | 'versions' | 'extra'

export interface PkgInfo {
  info?: Relation
  extra?: Relation[]
  circulation?: string[]
  versions?: { [key: string]: string[] }
}
