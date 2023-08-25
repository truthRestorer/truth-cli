import type { Relations } from '@truth-cli/shared'
import type { Pkgs } from './json.js'
import { genJson } from './json.js'

interface IContext {
  source: string
  push: (symbol: string) => void
  removeLastElm: () => string
  dealNewLine: (tabCount: number, shouldAdd?: boolean) => void
  dealEnd: () => void
}

enum ESymbol {
  TAB = ' ',
  VERTICAL = '│',
  ADD = '├─',
  LINE = '\n',
}

function createContext() {
  const context: IContext = {
    source: '',
    push(symbol: string) {
      context.source += symbol
    },
    removeLastElm() {
      context.source = context.source.slice(0, context.source.length - 1)
      return context.source[context.source.length - 1]
    },
    dealNewLine(tabCount: number, shouldAdd: boolean = false) {
      context.push(ESymbol.LINE)
      for (let i = 0; i < tabCount; i++) {
        context.push(ESymbol.VERTICAL)
        context.push(ESymbol.TAB.repeat(2))
      }
      context.push(shouldAdd ? ESymbol.ADD : ESymbol.VERTICAL)
    },
    dealEnd() {
      while (Object.values(ESymbol).includes(context.removeLastElm() as ESymbol)) { /* empty */ }
    },
  }
  return context
}

export function genTxt(depth: number, relations: Relations) {
  const { name, version, packages } = genJson(depth, relations)
  const ctx = createContext()
  const { dealNewLine, push, dealEnd } = ctx
  push(`${name} ${version}:`)
  function loadTxt(pkgs: Pkgs | undefined, tabCount: number) {
    if (!pkgs)
      return
    dealNewLine(tabCount)
    for (const [name, { packages, version }] of Object.entries(pkgs)) {
      dealNewLine(tabCount, true)
      push(`${name} ${version}`)
      loadTxt(packages, tabCount + 1)
    }
    dealNewLine(tabCount)
  }
  loadTxt(packages, 0)
  dealEnd()
  return ctx.source
}
