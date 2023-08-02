import type { ITree } from 'lib/utils/types.js'
import { assign, entries, isEmptyObj } from 'lib/utils/tools.js'
import { logFileWirteError } from '../utils/const.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

function loadTrees(trees: ITree[] | undefined, maxDep: number) {
  if (trees === undefined)
    return
  if (maxDep === 0) {
    for (let i = 0; i < trees.length; i++)
      delete trees[i].children
    return
  }
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    if (!tree.name)
      return
    const relatedPkg = relations[tree.name]
    if (relatedPkg) {
      const { devDependencies, dependencies } = relatedPkg
      const pkgs = assign(dependencies, devDependencies)
      for (const [name, version] of entries(pkgs)) {
        const add: ITree = {
          name,
          value: version as string,
          children: [],
        }
        const devDep = relations[name]?.devDependencies
        const dep = relations[name]?.dependencies
        if (
          isEmptyObj(assign(devDep, dep))
          || name === tree.name
          || rootPkgSet.has(name)
        )
          delete add.children
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1)
    }
  }
}

export async function genTree(maxDep: number) {
  const { name, version, devDependencies, dependencies } = rootPkg.__root__
  const treeData: ITree = {
    name: name ?? '__root__',
    value: version ?? 'latest',
    children: entries(assign(dependencies, devDependencies)).map(([name, version]) => ({
      name,
      value: version,
      children: [],
    })) as ITree[],
  }
  try {
    loadTrees(treeData.children, maxDep)
    return treeData
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
