import { LogNotExportPkg, logFileWirteError } from '../utils/const.js'
import { relations, rootPkg } from './relations.js'

interface ITree {
  name: string
  value: string
  children?: ITree[]
}

const treeData: ITree[] = []

async function initRootTree() {
  try {
    const { name, version, devDependencies, dependencies } = rootPkg.__root__
    treeData.push({
      name: name ?? '__root__',
      value: version ?? 'latest',
      children: Object.entries(Object.assign({}, dependencies, devDependencies)).map(([name, version]) => ({
        name,
        value: version,
        children: [],
      })) as ITree[],
    })
  }
  catch (err: any) {
    LogNotExportPkg(err.message)
  }
}

function loadTrees(trees: ITree[] | undefined, maxDep: number) {
  if (trees === undefined)
    return
  if (maxDep === 0) {
    for (let i = 0; i < trees.length; i++)
      delete trees[i].children
  }
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    const relatedPkg = relations[tree.name]!
    if (relatedPkg) {
      const { devDependencies, dependencies } = relatedPkg
      const pkgs = Object.assign({}, dependencies, devDependencies)
      for (const [name, version] of Object.entries(pkgs)) {
        const add: ITree = {
          name,
          value: version as string,
          children: [],
        }
        const devDep = relations[name]?.devDependencies
        const dep = relations[name]?.dependencies
        if (JSON.stringify(Object.assign({}, devDep, dep)) === '{}')
          delete add.children
        tree.children?.push(add)
      }
      loadTrees(tree.children, maxDep - 1)
    }
  }
}

export async function genTree(maxDep: number) {
  await initRootTree()
  try {
    loadTrees(treeData[0].children, maxDep)
    return treeData[0]
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
