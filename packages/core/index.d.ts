import { Nodes, Links, Pkgs, Relations, Tree, Versions } from '@truth-cli/shared'

declare function genGraph(relations: Relations): {
  nodes: Nodes[];
  links: Links[];
}

declare function genPkgs(depth: number, relations: Relations): Partial<Pkgs>

declare function genPkgTree(maxDep: number, relations: Relations): string

declare function genRelations(): Relations

declare function genTree(maxDep: number, relations: Relations): Tree

declare function genVersions(relations: Relations): Versions