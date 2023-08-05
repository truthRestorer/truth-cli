import { assign, entries, isEmptyObj } from '@truth-cli/shared'
import type { ITree } from '@truth-cli/shared'
import { relations, rootPkgSet } from './relations.js'

// treeMap 用户记录已经记住的节点，在 maxDep > 5 的时候会有值
const treeMap = new Map()

/**
 * 如果 rootPkgSet 或者 treeMap 保存过这个 tree 名字，或者说 tree 没有依赖。
 * 那么删除该项的 children 属性，减少生成的 tree.json 文件大小
 */
function deleteTreeChildren(add: ITree, name: string, dependencies: ITree) {
  if (
    isEmptyObj(dependencies)
    || rootPkgSet.has(name)
    || treeMap.has(name)
  )
    delete add.children
}
/**
 * 添加树节点
 */
function addTree(name: string, version: string, dependencies: ITree) {
  if (treeMap.has(name))
    return
  const add: ITree = {
    name,
    value: version,
    children: [assign(dependencies)],
  }
  deleteTreeChildren(add, name, dependencies)
  treeMap.set(name, add)
}
/**
 * 递归生成树，通过读取树节点的名字，查找 relations 表，递归生成子依赖
 * 当 maxDep > 4 时开启优化，此时 tree 会记住每一个经过的节点，不会进行删除操作
 */
function loadTrees(
  trees: ITree[] | undefined,
  maxDep: number,
  shouldOptimize: boolean,
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
    if (!relations[tree.name])
      continue
    const { version, devDependencies, dependencies } = relations[tree.name]
    const pkgs = assign(dependencies, devDependencies)
    addTree(tree.name, version, pkgs)
    for (const [name, version] of entries(pkgs)) {
      const add: ITree = {
        name,
        value: version as string,
        children: [],
      }
      const { devDependencies, dependencies } = relations[name] ?? {}
      deleteTreeChildren(add, name, assign(devDependencies, dependencies))
      tree.children?.push(add)
    }
    loadTrees(tree.children, maxDep - 1, shouldOptimize)
    shouldOptimize || treeMap.delete(tree.name)
  }
}
/**
 * 导出易于和命令行操作的函数
 */
export async function genTree(maxDep: number) {
  const { name, version, devDependencies, dependencies } = relations.__root__
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
  loadTrees(treeData[0].children, maxDep, maxDep > 5)
  treeData.push({
    name: '_remember_',
    value: 'latest',
    children: [...treeMap.values()],
  })
  return treeData
}
