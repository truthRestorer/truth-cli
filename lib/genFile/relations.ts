import path from 'node:path'
import type { IRelations } from 'lib/utils/types'
import { LogNotExportPkg } from '../utils/const'
import { readDir, readFile } from '../utils/tools'

export const relations: Partial<IRelations> = {}

async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = await readFile(p) as IRelations
    const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
    relations[pkg.name] = {
      name, description, version, homepage, dependencies, devDependencies, repository, author,
    }
    return
  }
  const pkgsRoot = await readDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (!pkgsRoot[i].includes('.')) {
      try {
        // 处理带有 @
        if (pkgsRoot[i].startsWith('@')) {
          const dirs = await readDir(pkgPath)
          for (let i = 0; i < dirs.length; i++)
            await readGlob(pkgPath)
        }
        else {
          const pkg = await readFile(`${pkgPath}/package.json`) as IRelations
          const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
          relations[pkg.name] = {
            name, description, version, homepage, dependencies, devDependencies, repository, author,
          }
        }
      }
      catch (err: any) {
        LogNotExportPkg(err.message)
      }
    }
  }
}

export default async function initRelations() {
  await readGlob('./package.json')
  await readGlob('./node_modules/')
  return relations
}
