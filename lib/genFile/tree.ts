// TODO: 生成 echarts 中 tree 图的数据
import path from 'node:path'
import { getPackageInfo } from 'local-pkg'
import { LogNotExportPkg, logFileWirteError } from '../utils/const'
import { readFile } from '../utils/tools'

interface ITree {
  name: string
  value: string
  children: ITree[]
}

const treeData: ITree = {
  name: '',
  value: '',
  children: [],
}

async function initRootTree() {
  try {
    const { name, version, devDependencies, dependencies } = await readFile(path.resolve('./package.json'))
    treeData.children.push({
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

async function loadTrees(trees: ITree[], maxDep: number) {
  if (maxDep === 0)
    return
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i]
    const packageInfo = await getPackageInfo(tree.name)
    if (packageInfo) {
      const { packageJson } = packageInfo
      const pkgs = Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
      for (const [name, version] of Object.entries(pkgs)) {
        tree.children.push({
          name,
          value: version,
          children: [],
        })
      }
    }
    await loadTrees(tree.children, maxDep - 1)
  }
}

export default async function genTree(maxDep: number) {
  await initRootTree()
  try {
    await loadTrees(treeData.children, maxDep)
    return treeData.children[0]
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
