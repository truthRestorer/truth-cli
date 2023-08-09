import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 最终生成的json数据结构
 */
export interface ModuleJsonValue extends ModuleInfo {
  dependencies: ModuleInfo[]
  devDependencies: ModuleInfo[]
}

export interface ModuleInfo {
  name: string
  version: string
  url: string
  homePath: string
  description?: string
}

export interface sonModules {
  // 开发依赖列表
  devDependencies: ModuleInfo[]
  // 非开发依赖的列表
  dependencies: ModuleInfo[]
}

export type DependencyGraph = Map<ModuleInfo, sonModules>

/**
 * 邻接表类
 */
export class Dependencies {
  private readonly _graph: DependencyGraph

  constructor() {
    this._graph = new Map<ModuleInfo, sonModules>()
  }

  /**
   * 获取依赖邻接表
   */
  get graph(): DependencyGraph {
    return this._graph
  }

  /**
   * 判断该依赖是否存在
   * @param moduleInfo
   * @private
   */
  public hasKey(moduleInfo: ModuleInfo | null): boolean {
    for (const key of this._graph.keys()) {
      if (
        key.name === moduleInfo?.name && key.version === moduleInfo?.version
      )
        return true
    }
    return false
  }

  /**
   * 获取依赖的引用
   * @param moduleInfo
   * @private
   */
  public getKey(moduleInfo: ModuleInfo | null): ModuleInfo | null {
    for (const key of this._graph.keys()) {
      if (key.name === moduleInfo?.name && key.version === moduleInfo?.version)
        return key
    }
    return null
  }

  public getValue(moduleInfo: ModuleInfo | null): sonModules | undefined {
    for (const key of this._graph.keys()) {
      if (key.name === moduleInfo?.name && key.version === moduleInfo?.version)
        return this._graph.get(moduleInfo)
    }
    return undefined
  }

  /**
   * 添加父节点，如果失败返回false，如果成功则返回true
   * @param moduleInfo 依赖信息
   */
  public setDependency(moduleInfo: ModuleInfo): boolean {
    if (!this.hasKey(moduleInfo)) {
      this._graph.set(moduleInfo, { devDependencies: [], dependencies: [] })
      return true
    }
    else {
      return false
    }
  }

  /**
   * 添加父依赖下的子依赖
   * @param rootModule 节点
   * @param edgeModule 边节点
   * @param isDev 是否是开发依赖
   */
  public addEdgeModule(
    rootModule: ModuleInfo,
    edgeModule: ModuleInfo,
    isDev: boolean,
  ) {
    if (isDev)
      this._graph.get(rootModule)!.devDependencies.push(edgeModule)
    else
      this._graph.get(rootModule)!.dependencies.push(edgeModule)
  }

  /**
   * 输出json文件
   * @param p 路径
   * @param begin 计算的开始时间，通过Date.now()获取
   */
  public async writeFile(p: string) {
    const obj: { [key: string]: ModuleJsonValue } = {}
    for (const [key, value] of this._graph.entries()) {
      obj[`${key.name} ${key.version}`] = {
        ...key,
        dependencies: value.dependencies,
        devDependencies: value.devDependencies,
      }
    }
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(obj))
  }
}

export const pkgData = new Dependencies()
