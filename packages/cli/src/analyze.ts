import fs from 'node:fs'
import type { PackageResolvingOptions } from 'local-pkg'
import { getPackageInfo } from 'local-pkg'
import { transPath } from '@truth-cli/shared/src/tools'
import { logFileWirteError, logFileWirteFinished } from '@truth-cli/shared'
import type { ModuleInfo } from './utils/dependency'
import { pkgData } from './utils/dependency'

export default class Analyze {
  private readonly dependencies: any
  private readonly devDependencies: any

  /**
   *  获取package.json中的依赖
   */
  constructor() {
    const json = fs.readFileSync('package.json')
    const { devDependencies, dependencies } = JSON.parse(json.toString())
    this.dependencies = dependencies
    this.devDependencies = devDependencies
  }

  /**
   * 初始化依赖信息，仅包含package.json中的依赖
   * @private
   */
  private async init() {
    for (const name of Object.keys(this.devDependencies ?? {}) as any) {
      const info = await this.getModuleInfo(name, { paths: [''] })
      if (info && info[0])
        pkgData.setDependency(info[0])
    }
    for (const name of Object.keys(this.dependencies ?? {}) as any) {
      const info = await this.getModuleInfo(name, { paths: [''] })
      if (info && info[0])
        pkgData.setDependency(info[0])
    }
  }

  /**
   * 异步获取依赖的信息,返回三个数据：依赖信息，所依赖的非开发依赖，所依赖的开发依赖
   * @param name 依赖名
   * @param path 依赖所在的位置
   * @private
   */
  private async getModuleInfo(
    name: string,
    path: PackageResolvingOptions,
  ): Promise<[ModuleInfo, Record<string, string>, Record<string, string>] | null> {
    return new Promise<[ModuleInfo, Record<string, string>, Record<string, string>] | null>((resolve) => {
      getPackageInfo(name, path).then((data) => {
        if (!data) {
          resolve(null)
        }
        else {
          const moduleInfo = {
            name: data.name,
            version: data.version,
            url: data.packageJson.homepage ?? '',
            homePath: data.rootPath,
            description: data.packageJson.description ?? '',
          }
          if (data.rootPath.startsWith('.'))
            resolve(null)
          resolve([moduleInfo, data.packageJson.dependencies ?? {}, data.packageJson.devDependencies ?? {}])
        }
      }).catch(() => { resolve(null) })
    })
  }

  /**
   * 为pkgData添加依赖
   * @param rootModule
   * @param newModuleName
   * @param path
   * @param isDev
   * @private
   */
  private async addModule(
    rootModule: ModuleInfo,
    newModuleName: string,
    path: PackageResolvingOptions,
    isDev: boolean,
  ) {
    const rootPath = transPath(rootModule.homePath)
    // 优先在该依赖的路径下寻找，若没找到则返回的是根目录下的
    const info = (await this.getModuleInfo(newModuleName, { paths: [rootPath] })) || (await this.getModuleInfo(newModuleName, path))
    if (info && info[0]) {
      if (pkgData.setDependency(info[0])) {
        pkgData.addEdgeModule(rootModule, info[0], isDev)
        let sonPath: PackageResolvingOptions
        if (transPath(info[0].homePath).includes(`${rootPath}/`))
          sonPath = { paths: [rootPath] }// 说明新依赖在根依赖的目录下
        else
          sonPath = path
        await this.findModule(info[0], sonPath)
      }
      else {
        const newModule = pkgData.getKey(info[0]) // 确保获取到的是对象的引用而不是复制
        pkgData.addEdgeModule(rootModule, newModule!, isDev)
      }
    }
  }

  /**
   * 递归获取父依赖下的所有子依赖
   * @param moduleInfo
   * @param path
   */
  private async findModule(
    moduleInfo: ModuleInfo,
    path: PackageResolvingOptions,
  ) {
    // 若该依赖的子依赖已经添加过了，就跳出递归
    const flag = pkgData.getValue(moduleInfo)!.dependencies.length > 0 || pkgData.getValue(moduleInfo)!.devDependencies.length > 0
    if (flag)
      return

    const [_, dependencyRecord, devDependencyRecord] = (await this.getModuleInfo(moduleInfo.name, path)) || []
    for (const dependencyName in dependencyRecord)
      await this.addModule(moduleInfo, dependencyName, path, false)

    for (const devDependencyName in devDependencyRecord)
      await this.addModule(moduleInfo, devDependencyName, path, true)
  }

  /**
   * 开始计算，并生成json文件
   * @param p
   */
  public async analyze(p: string = './') {
    const begin = Date.now()
    try {
      await this.init()
      for (const moduleInfo of pkgData.graph.keys())
        await this.findModule(moduleInfo, { paths: [''] })

      await pkgData.writeFile(p)
      const end = Date.now()
      logFileWirteFinished(end - begin, p, 'txt')
    }
    catch (err: any) {
      logFileWirteError(err.message)
    }
  }
}

export const analyze = new Analyze()
