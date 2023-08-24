import type { Relations, Tree } from '@truth-cli/shared'

export function genTree(depth: number, relations: Relations) {
  // treeSet 用户记录已经记住的节点，在 depth > 4 不会删除记住过的节点
  const {
    name = '__root__',
    version = 'latest',
    dependencies = {},
    devDependencies,
  } = relations.__root__
  const rootPkgs = Object.assign(dependencies, devDependencies)
  const treeSet = new Set()
  const tree: Tree = {
    name,
    value: version,
    children: Object.entries(rootPkgs).map(([rootName, rootVersion]) => ({
      name: rootName,
      value: rootVersion as string,
      children: [],
    })),
  }
  // 递归生成树，通过读取树节点的名字，查找 relations 表，递归生成子依赖
  function loadTrees(trees: Tree[], depth: number) {
    if (depth <= 0)
      return
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i]
      if (!relations[tree.name])
        continue
      const { devDependencies, dependencies = {} } = relations[tree.name]
      const pkgs = Object.assign(dependencies, devDependencies)
      treeSet.add(tree.name)
      for (const [name, version] of Object.entries(pkgs)) {
        if (!treeSet.has(name)) {
          const add: Tree = { name, value: version as string, children: [] }
          tree.children.push(add)
        }
      }
      loadTrees(tree.children, depth - 1)
      treeSet.delete(tree.name)
    }
  }
  loadTrees(tree.children, depth - 1)
  return tree
}
