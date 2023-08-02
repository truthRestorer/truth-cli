import type { ITree } from 'lib/utils/types.js'
import { assign, entries, isEmptyObj } from 'lib/utils/tools.js'
import { logFileWirteError } from '../utils/const.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

const treeSet = new Set()

function loadTrees(trees: ITree[] | undefined, maxDep: number, shouldOptimize: boolean) {
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
    treeSet.add(tree.name)
    if (relatedPkg) {
      const { devDependencies, dependencies } = relatedPkg
      const pkgs = assign(dependencies, devDependencies)
      for (const [name, version] of entries(pkgs)) {
        const add: ITree = {
          name,
          value: version as string,
          children: [],
        }
        const { devDependencies, dependencies } = relations[name] ?? {}
        if (
          isEmptyObj(assign(devDependencies, dependencies))
          || name === tree.name
          || rootPkgSet.has(name)
          || treeSet.has(name)
        )
          delete add.children
        shouldOptimize && treeSet.add(name)
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1, shouldOptimize)
      !shouldOptimize && treeSet.delete(tree.name)
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
    loadTrees(treeData.children, maxDep, maxDep > 5)
    return treeData
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
