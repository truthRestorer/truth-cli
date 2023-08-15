import { assign, entries, isEmptyObj } from '@truth-cli/shared'
import type { Relations, Tree } from '@truth-cli/shared'

// treeSet 用户记录已经记住的节点，在 maxDep > 4 不会删除记住过的节点
const treeSet = new Set()
const rootPkgSet = new Set()
/**
 * 如果 treeSet 保存过这个 tree 名字，或者说 tree 没有依赖。
 * 那么删除该项的 children 属性，减少生成的 tree.json 文件大小
 */
function deleteTreeChildren(add: Tree, name: string, dependencies: Tree) {
  if (isEmptyObj(dependencies) || treeSet.has(name))
    delete add.children
}
/**
 * 添加树节点
 */
function addTree(name: string, version: string, dependencies: Tree) {
  if (treeSet.has(name))
    return
  const add: Tree = {
    name,
    value: version,
    children: [assign(dependencies)],
  }
  deleteTreeChildren(add, name, dependencies)
  treeSet.add(name)
}
/**
 * 导出易于和命令行操作的函数
 */
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
  function loadTrees(trees: Tree[] | undefined, maxDep: number, shouldOptimize: boolean) {
    if (!trees)
      return
    if (maxDep <= 0) {
      for (let i = 0; i < trees.length; i++)
        delete trees[i].children
      return
    }
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i]
      if (!relations[tree.name])
        continue
      const { version, devDependencies, dependencies } = relations[tree.name]
      const pkgs = assign(dependencies, devDependencies)
      addTree(tree.name, version ?? 'latest', pkgs)
      for (const [name, version] of entries(pkgs)) {
        const add: Tree = { name, value: version as string, children: [] }
        const { devDependencies, dependencies } = relations[name] ?? {}
        deleteTreeChildren(add, name, assign(devDependencies, dependencies))
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1, shouldOptimize)
      shouldOptimize || rootPkgSet.has(tree.name) || treeSet.delete(tree.name)
    }
  }
  loadTrees(treeData.children, maxDep - 1, maxDep > 7)
  return treeData
}
