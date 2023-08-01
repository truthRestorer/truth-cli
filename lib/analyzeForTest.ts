import fs from 'node:fs'
import { getPackageInfo, PackageResolvingOptions } from 'local-pkg'
// @ts-ignore
import { LogNotExportPkg } from './src/const.ts'
// @ts-ignore
import { DependencyGraph, ModuleInfo, pkgData } from './utils/dependency.ts'

export default class Analyze {
  private readonly dependencies: any
  private readonly devDependencies: any
  /**
   * 获取package.json中的依赖
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
    try {
      for (const name of Object.keys(this.devDependencies ?? {}) as any) {
        const info = await this.getMouduleInfo(name, true, { paths: [''] })
        pkgData.setDependency(info ? info[0] : info)
      }
      for (const name of Object.keys(this.dependencies ?? {}) as any) {
        const info = await this.getMouduleInfo(name, false, { paths: [''] })
        pkgData.setDependency(info ? info[0] : info)
      }
    } catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
  /**
   * 异步获取依赖的信息,返回三个数据：依赖信息，所依赖的非开发依赖，所依赖的开发依赖
   * @param name 依赖名
   * @param path 依赖所在的位置
   * @param isDev 是否是开发依赖
   * @private
   */
  private async getMouduleInfo(
    name: string,
    isDev: boolean,
    path: PackageResolvingOptions,
  ): Promise<[ModuleInfo, Record<string, string>, Record<string, string>] | null> {
    return new Promise<[ModuleInfo, Record<string, string>, Record<string, string>] | null>((resolve) => {
      getPackageInfo(name, path)
        .then((data) => {
          if (!data) {
            resolve(null)
          } else {
            const moduleInfo = {
              name: data.name,
              version: data.version,
              isDev: isDev,
              url: data.packageJson.homepage ?? '',
              homePath: data.rootPath,
              description: data.packageJson.description ?? '',
            }
            if (data.rootPath.length < 4) {
              console.log(data.rootPath)
            }
            resolve([moduleInfo, data.packageJson.dependencies ?? {}, data.packageJson.devDependencies ?? {}])
          }
        })
        .catch((error) => {
          LogNotExportPkg(error.message)
          resolve(null)
        })
    })
  }

  /**
   * 递归获取该依赖下的所有依赖
   * @param moduleInfo
   * @param path
   */
  public async findModule(moduleInfo: ModuleInfo, path: PackageResolvingOptions) {
    if (moduleInfo.homePath.startsWith('.')) {
      return
    }
    const [_, dependencyRecord, devDependencyRecord] =
      (await this.getMouduleInfo(moduleInfo.name, moduleInfo.isDev, path)) || []
    //循环非开发依赖，递归的条件是如果在依赖包的路径下发现了该依赖的依赖
    for (const dependencyName in dependencyRecord) {
      const regPath = moduleInfo.homePath.match(/node_modules(.*)/)
      const strPath = regPath ? regPath[0].replace(/\\/g, '/') : ''
      //优先在该依赖的路径下寻找，若没找到则返回的是根目录下的
      const info = await this.getMouduleInfo(dependencyName, false, { paths: [strPath] })
      if (info) {
        pkgData.setDependency(info[0])
        //确保获取到的是对象的引用而不是复制
        const newModule = pkgData.getKey(info[0])
        if (newModule) {
          pkgData.addEdgeModule(moduleInfo, newModule)
          if (info[0].homePath.match(/node_modules/g)) {
            await this.findModule(newModule, path)
          }
        }
      }
    }
    //循环开发依赖，逻辑与上面一致
    for (const devDependencyName in devDependencyRecord) {
      this.getMouduleInfo(devDependencyName, true, path).then((info) => {
        if (pkgData.setDependency(info ? info[0] : info)) {
        }
      })
    }
  }

    /**
     * 开始计算，并生成json
     * @param p
     */
  public async analyze(p: string = './') {
    await this.init()
    for (const moduleInfo of pkgData.graph.keys()) {
      await this.findModule(moduleInfo, { paths: [''] })
    }
    await pkgData.writeFile(p)
  }
}

export const analyze = new Analyze()
