import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import type { Relation, Relations } from '@truth-cli/shared'

export async function useReadFile(p: string) {
  const json = await fsp.readFile(p, 'utf-8')
  return JSON.parse(json)
}

export async function genBaseRelation() {
  const {
    name,
    version = 'latest',
    dependencies,
    devDependencies,
    homepage,
  } = await useReadFile('package.json')
  const relations: Relations = {
    __root__: {
      name: name ?? '__root__',
      path: path.resolve('package.json'),
      version,
      dependencies,
      devDependencies,
      homepage,
    },
    __extra__: {},
  }
  // 这里由于 genRelations 直接读取根目录中的 package.json，对单测覆盖率有影响
  if (name) {
    relations[name] = { name, version, dependencies, devDependencies, homepage }
  }
  return relations
}

/**
 * truth-cli 为了优化读文件的操作，选择了读取文件后形成一个 relations，后续文件的生成都依赖于这个 relations
 * nodejs 读取文件的速度很慢，`truth-cli` 只会读取一次(根目录和 node_modules 目录的 package.json)，形成一种对象格式
 * 由于根据对象键值查找时间复杂度为 O(1)，这样效率很大大提升
 */
export async function genRelations() {
  // 先读取项目的 package.json
  const relations = await genBaseRelation()

  async function readGlob(p: string) {
    const dirs = await fsp.readdir(p, { withFileTypes: true })
    await Promise.all(
      dirs.map(async (dir) => {
        const pkgPath = path.join(p, dir.name)
        if (dir.name === '.bin' || !dir.isDirectory()) {
          return
        }
        const filePath = path.join(pkgPath, 'package.json')
        if (fs.existsSync(filePath)) {
          const pkg = await useReadFile(filePath)
          const { name, version, dependencies, devDependencies, homepage } = pkg
          const add: Relation = {
            name,
            version,
            path: filePath,
            homepage,
            dependencies,
            devDependencies,
          }
          if (relations[name]) {
            if (
              relations[name].version === version ||
              relations.__extra__[name]?.[version] === version
            ) {
              return
            }
            if (relations.__extra__[name]) {
              relations.__extra__[name][version] = add
            } else relations.__extra__[name] = { [version]: add }
            return
          }
          relations[name] = add
        } else {
          // 一般开发包的 node_modules 内部，只包含 .bin 执行脚本
          // 更完整的实现：https://github.com/Plumbiu/read-glob-file
          await readGlob(pkgPath)
        }
      }),
    )
  }
  // 读取 node_modules 目录下的所有 package.json 文件
  await readGlob('node_modules')
  return relations
}
