import { assign, entries } from '@truth-cli/shared'
import type { Relations, Tree } from '@truth-cli/shared'

// treeSet 用户记录已经记住的节点，在 maxDep > 4 不会删除记住过的节点
const treeSet = new Set()
const rootPkgSet = new Set()

/**
 * 添加树节点
 */
function addTree(name: string) {
  if (treeSet.has(name))
    return
  treeSet.add(name)
}

export function genTree(maxDep: number, relations: Relations) {
  const { name, version, devDependencies, dependencies } = relations.__root__
  const treeData: Tree = {
    name: name ?? '__root__',
    value: version ?? 'latest',
    children: entries(assign(dependencies, devDependencies)).map(([name, version]) => {
      rootPkgSet.add(name)
      treeSet.add(name)
      return {
        name,
        value: version,
        children: [],
      }
    }),
  }
  /**
   * 递归生成树，通过读取树节点的名字，查找 relations 表，递归生成子依赖
   * 当 maxDep > 4 时开启优化，此时 tree 会记住每一个经过的节点，不会进行删除操作
   */
  const shouldOptimize = maxDep > 5
  function loadTrees(trees: Tree[] | undefined, maxDep: number) {
    if (!trees || maxDep <= 0)
      return
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i]
      if (!relations[tree.name])
        continue
      const { devDependencies, dependencies } = relations[tree.name]
      const pkgs = assign(dependencies, devDependencies)
      addTree(tree.name)
      for (const [name, version] of entries(pkgs)) {
        const add: Tree = { name, value: version as string, children: [] }
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1)
      shouldOptimize || rootPkgSet.has(tree.name) || treeSet.delete(tree.name)
    }
  }
  loadTrees(treeData.children, maxDep - 1)
  return treeData
}
