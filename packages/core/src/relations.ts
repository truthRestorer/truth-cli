import fs from 'node:fs'
import path from 'node:path'
import type { Relation, Relations } from '@truth-cli/shared'

export function useReadFile(p: string) {
  const json = fs.readFileSync(p, 'utf-8')
  return JSON.parse(json)
}

export function genBaseRelation() {
  const {
    name,
    version = 'latest',
    dependencies,
    devDependencies,
    homepage,
  } = useReadFile('package.json')
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
export function genRelations() {
  // 先读取项目的 package.json
  const relations = genBaseRelation()

  function readGlob(p: string) {
    const dirs = fs.readdirSync(p, { withFileTypes: true })
    for (const dir of dirs) {
      const pkgPath = path.join(p, dir.name)
      if (dir.name === '.bin' || !dir.isDirectory()) {
        continue
      }
      const filePath = `${pkgPath}/package.json`
      if (fs.existsSync(filePath)) {
        const pkg = useReadFile(filePath)
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
            continue
          }
          if (relations.__extra__[name]) {
            relations.__extra__[name][version] = add
          } else relations.__extra__[name] = { [version]: add }
          continue
        }
        relations[name] = add
      } else {
        // 一般开发包的 node_modules 内部，只包含 .bin 执行脚本
        // 如果 node_modules 里面还有其他包，说明可能存在一些问题
        // 更完整的实现：https://github.com/Plumbiu/read-glob-file
        readGlob(pkgPath)
      }
    }
  }
  // 读取 node_modules 目录下的所有 package.json 文件
  readGlob('node_modules')
  return relations
}
