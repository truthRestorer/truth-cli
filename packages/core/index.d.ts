import { Nodes, Links, Pkgs, Relations, Relation, Tree, Versions } from '@truth-cli/shared'

declare function genGraph(relation: Relation, target?: string): {
  nodes: Nodes[]
  links: Links[]
}

declare function genPkgs(depth: number, relations: Relations, shouldOptimize?: boolean): Pkgs

declare function genPkgTree(depth: number, relations: Relations): string

declare function genRelations(): Relations

declare function genTree(maxDep: number, relations: Relations): Tree

declare function genVersions(relations: Relations): Versions