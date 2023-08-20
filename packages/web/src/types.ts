import type { Relation } from '@truth-cli/shared'

export interface PkgInfo {
  __info__?: Relation | Partial<Relation>
  __circulation__?: string[]
  __versions__?: { [key: string]: string[] | string }
}

export type Legend = 'Tree' | 'Graph'
