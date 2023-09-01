import fs from 'node:fs'
import path from 'node:path'
import { type Relations, isEmptyObj } from '@truth-cli/shared'

export function useReadFile(p: string) {
  const json = fs.readFileSync(p, 'utf-8')
  return JSON.parse(json)
}
/**
 * truth-cli 为了优化读文件的操作，选择了读取文件后形成一个 relations，后续文件的生成都依赖于这个 relations
 * nodejs 读取文件的速度很慢，`truth-cli` 只会读取一次(根目录和 node_modules 目录的 package.json)，形成一种对象格式
 * 由于根据对象键值查找时间复杂度为 O(1)，这样效率很大大提升
 */
export function genRelations() {
  // 先读取项目的 package.json
  const {
    name,
    version = 'latest',
    dependencies,
    devDependencies,
    homepage,
  } = useReadFile('package.json')
  const relations: Relations = {
    __root__: { name: name ?? '__root__', version, dependencies, devDependencies, homepage },
  }
  if (name)
    relations[name] = { name, version, dependencies, devDependencies, homepage }
  function readGlob(p: string) {
    const dirs = fs.readdirSync(p)
    for (let i = 0; i < dirs.length; i++) {
      const pkgPath = path.join(p, dirs[i])
      if (dirs[i] === '.bin' || !fs.lstatSync(pkgPath).isDirectory())
        continue
      const filePath = path.join(pkgPath, 'package.json')
      if (fs.existsSync(filePath)) {
        const pkg = useReadFile(filePath)
        const { name, version, dependencies, devDependencies, homepage } = pkg
        relations[name] = { name, version, homepage }
        // 像 @types/node 这种包，虽然没有依赖，但是却有 dependencies 字段，所以用 isEmptyObj 判断
        isEmptyObj(dependencies) || (relations[name].dependencies = dependencies)
        isEmptyObj(devDependencies) || (relations[name].devDependencies = devDependencies)
      }
      else {
        // 你可能会看到有的包下面还有 node_modules，一般情况下，这里面只包含 .bin 执行脚本
        // 如果 node_modules 里面还有其他包，说明这个包可能打包有问题
        // 更完整的实现：https://github.com/Plumbiu/read-glob-file
        readGlob(pkgPath)
      }
    }
  }
  // 读取 node_modules 目录下的所有 package.json 文件
  readGlob('node_modules')
  return relations
}
