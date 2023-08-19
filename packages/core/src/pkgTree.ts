import type { IContext, Pkgs, Relations } from '@truth-cli/shared'
import { useEntries } from '@truth-cli/shared'
import { genPkgs } from './pkgs.js'

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
      if (shouldAdd)
        context.push(ESymbol.ADD)
      else
        context.push(ESymbol.VERTICAL)
    },
    dealEnd() {
      while (Object.values(ESymbol).includes(context.removeLastElm() as ESymbol)) { /* empty */ }
    },
  }
  return context
}

export function genPkgTree(depth: number, relations: Relations) {
  const { name, version, packages } = genPkgs(depth, relations)
  const ctx = createContext()
  const { dealNewLine, push, dealEnd } = ctx
  push(`${name} ${version}:`)
  function loadTreeFile(pkgs: Pkgs | undefined, tabCount: number) {
    if (!pkgs)
      return
    dealNewLine(tabCount)
    for (const [name, { packages, version }] of useEntries(pkgs)) {
      dealNewLine(tabCount, true)
      push(`${name} ${version}`)
      loadTreeFile(packages, tabCount + 1)
    }
    dealNewLine(tabCount)
  }
  loadTreeFile(packages, 0)
  dealEnd()
  return ctx.source
}
