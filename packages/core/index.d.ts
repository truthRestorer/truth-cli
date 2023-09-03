import { Nodes, Links, Relations, Relation, Tree, Versions } from '@truth-cli/shared'
import { PkgJson } from './src/json'

declare function genGraph(relation: Relation, target?: string, category?: GraphDependency): {
  nodes: Nodes[];
  links: Links[];
}

declare function genJson(depth: number, relations: Relations, shouldOptimize?: boolean): PkgJson

declare function genTxt(depth: number, relations: Relations): string


declare function genTree(maxDep: number, relations: Relations): Tree

declare function genVersions(relations: Relations): Versions

declare function genCirculation(relations: Relations): Record<string, string[]>
