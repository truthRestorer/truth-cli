import { INodes, ILinks, IPkgs, IRelations, ITree, IVersions } from '@truth-cli/shared'

declare function genGraph(): {
  nodes: INodes[];
  links: ILinks[];
}

declare function genPkgs(depth: number): IPkgs

declare function genPkgTree(maxDep: number): string

declare function genRelations(): Partial<IRelations>

declare function genTree(maxDep: number): ITree

declare function genVersions(): IVersions