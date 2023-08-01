import path from 'node:path'
import { LogNotExportPkg, logFileWirteError } from '../utils/const.js'
import { readFile } from '../utils/tools.js'
import { relations } from './relations.js'

interface ITree {
  name: string
  value: string
  children: ITree[]
}

const treeData: ITree[] = []

async function initRootTree() {
  try {
    const { name, version, devDependencies, dependencies } = await readFile(path.resolve('./package.json'))
    treeData.push({
      name,
      value: version,
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

function loadTrees(trees: ITree[], maxDep: number) {
  if (maxDep === 0)
    return
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    const relatedPkg = relations[tree.name]!
    if (relatedPkg) {
      const { devDependencies, dependencies } = relatedPkg
      const pkgs = Object.assign({}, dependencies, devDependencies)
      for (const [name, version] of Object.entries(pkgs)) {
        tree.children.push({
          name,
          value: version as string,
          children: [],
        })
      }
    }
    loadTrees(tree.children, maxDep - 1)
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
