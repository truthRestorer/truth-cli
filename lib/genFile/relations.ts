import path from 'node:path'
import { LogNotExportPkg } from '../utils/const'
import { readDir, readFile } from '../utils/tools'

export const relations: { [key: string]: any } = {}

async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = await readFile(p)
    relations[pkg.name] = pkg
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
          const pkg = await readFile(`${pkgPath}/package.json`)
          relations[pkg.name] = pkg
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
