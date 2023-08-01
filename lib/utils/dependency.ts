import fs from 'node:fs'
import path from 'node:path'

export interface ModuleJsonValue extends ModuleInfo {
  dependencies: ModuleInfo[]
}
export interface ModuleInfo {
  name: string
  version: string
  isDev: boolean
  url?: string
  homePath: string
  description?: string
}

export type DependencyGraph = Map<ModuleInfo, ModuleInfo[]>

export class Dependencies {
  private _graph: DependencyGraph
  constructor() {
    this._graph = new Map<ModuleInfo, ModuleInfo[]>()
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
  private hasKey(moduleInfo: ModuleInfo | null): boolean {
    for (const key of this._graph.keys()) {
      if (key.name == moduleInfo?.name && key.version == moduleInfo?.version) {
        return true
      }
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
      if (key.name == moduleInfo?.name && key.version == moduleInfo?.version) {
        return key
      }
    }
    return null
  }
  /**
   * 添加依赖节点，如果存在返回false，如果不存在则返回true
   * @param moduleInfo 依赖信息
   */
  public setDependency(moduleInfo: ModuleInfo | null): boolean {
    if (!moduleInfo) {
      return false
    }
    if (!this.hasKey(moduleInfo)) {
      this._graph.set(moduleInfo, [])
      return true
    } else {
      return false
    }
  }

  /**
   *
   * @param rootModule 节点
   * @param edgeModule 边节点
   */
  public addEdgeModule(rootModule: ModuleInfo, edgeModule: ModuleInfo) {
    this._graph.get(rootModule)!.push(edgeModule)
  }

  public async writeFile(p: string) {
    const obj: { [key: string]: ModuleJsonValue } = {}
    for (const [key, value] of this._graph.entries()) {
      obj[key.name + ' ' + key.version] = { ...key, dependencies: value }
    }
    console.log(obj)
    fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(obj), (err) => {
      if (err) {
        throw new Error('出错了')
      }
    })
  }
}

export const pkgData = new Dependencies()
