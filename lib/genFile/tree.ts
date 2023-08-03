import type { ITree } from '../utils/types.js'
import { assign, entries, isEmptyObj } from '../utils/tools.js'
import { logFileWirteError } from '../utils/const.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

const treeMap = new Map()

function loadTrees(
  trees: ITree[] | undefined,
  maxDep: number,
  rememberLayer: number,
) {
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
      const { version: treeVersion, devDependencies, dependencies } = relatedPkg
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
          || treeMap.has(name)
        )
          delete add.children
        if (rememberLayer && !treeMap.has(name)) {
          treeMap.set(tree.name, {
            name,
            value: treeVersion,
          })
        }
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1, rememberLayer - 1 ? rememberLayer - 1 : 0)
    }
  }
}

export async function genTree(maxDep: number) {
  const { name, version, devDependencies, dependencies } = rootPkg.__root__
  const treeData: ITree[] = [
    {
      name: name ?? '_root_',
      value: version ?? 'latest',
      children: entries(assign(dependencies, devDependencies)).map(([name, version]) => ({
        name,
        value: version,
        children: [],
      })),
    },
  ]
  try {
    loadTrees(treeData[0].children, maxDep, 2)
    treeData.push({
      name: '_remember_',
      value: 'latest',
      children: [...treeMap.values()],
    })
    return treeData
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
