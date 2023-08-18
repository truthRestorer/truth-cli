import { useAssign, useEntries } from '@truth-cli/shared'
import type { Relations, Tree } from '@truth-cli/shared'

export function genTree(maxDep: number, relations: Relations) {
  // treeSet 用户记录已经记住的节点，在 maxDep > 4 不会删除记住过的节点
  const { name, version, devDependencies, dependencies } = relations.__root__
  const rootPkgs = useAssign(dependencies, devDependencies)
  const rootPkgSet = new Set(Object.keys(name))
  const treeSet = new Set(Object.keys(name))
  const tree: Tree = {
    name: name ?? '__root__',
    value: version ?? 'latest',
    children: useEntries(rootPkgs).map(([rootName, rootVersion]) => ({
      name: rootName,
      value: rootVersion,
      children: [],
    })),
  }
  /**
   * 递归生成树，通过读取树节点的名字，查找 relations 表，递归生成子依赖
   * 当 maxDep > 4 时开启优化，此时 tree 会记住每一个经过的节点，不会进行删除操作
   */
  const shouldOptimize = maxDep > 5
  function loadTrees(trees: Tree[], maxDep: number) {
    if (!trees || maxDep <= 0)
      return
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i]
      if (!relations[tree.name])
        continue
      const { devDependencies, dependencies } = relations[tree.name]
      const pkgs = useAssign(dependencies, devDependencies)
      treeSet.add(name)
      for (const [name, version] of useEntries(pkgs)) {
        const add: Tree = { name, value: version as string, children: [] }
        tree.children.push(add)
      }
      loadTrees(tree.children, maxDep - 1)
      shouldOptimize || rootPkgSet.has(tree.name) || treeSet.delete(tree.name)
    }
  }
  loadTrees(tree.children, maxDep - 1)
  return tree
}
