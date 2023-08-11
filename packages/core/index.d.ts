import { INodes, ILinks, IPkgs, IRelations, ITree, IVersions } from '@truth-cli/shared'

declare function genGraph(): Promise<{
  nodes: INodes[];
  links: ILinks[];
}>

declare function genPkgs(depth: number): IPkgs

declare function genPkgTree(maxDep: number): Promise<string>

declare function genRelations(): Promise<Partial<IRelations>>

declare function genTree(maxDep: number): Promise<ITree>

declare function genVersions(): Promise<IVersions>