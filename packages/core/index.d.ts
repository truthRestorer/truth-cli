import { Nodes, Links, Pkgs, Relations, Tree, Versions } from '@truth-cli/shared'

declare function genGraph(): {
  nodes: Nodes[];
  links: Links[];
}

declare function genPkgs(depth: number): Pkgs

declare function genPkgTree(maxDep: number): string

declare function genRelations(): Partial<Relations>

declare function genTree(maxDep: number): Tree

declare function genVersions(): Versions