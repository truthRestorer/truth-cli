export interface IOptions {
  dep: number
  isBoth?: boolean
  isDev?: boolean
  isDeploy?: boolean
}

export interface IContext {
  source: string
  push: (symbol: string) => void
  removeLastElm: () => string
  dealNewLine: (tabCount: number, shouldAdd?: boolean) => void
  dealEnd: () => void
}
