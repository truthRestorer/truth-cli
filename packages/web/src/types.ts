import type { Relation } from 'packages/shared'

export type Legend = 'Tree' | 'Graph'

export interface PkgInfo {
  info?: Relation
  circulation?: string[]
  versions?: { [key: string]: string[] }
}
