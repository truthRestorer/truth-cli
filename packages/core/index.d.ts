import { Nodes, Links, Relations, Relation, Tree, Versions } from '@truth-cli/shared'
import { PkgJson } from './src/json'

declare function genGraph(relation: Relation, target?: string): {
  nodes: Nodes[]
  links: Links[]
}

declare function genJson(depth: number, relations: Relations, shouldOptimize?: boolean): PkgJson

declare function genTxt(depth: number, relations: Relations): string

declare function genRelations(): Relations

declare function genTree(maxDep: number, relations: Relations): Tree

declare function genVersions(relations: Relations): Versions