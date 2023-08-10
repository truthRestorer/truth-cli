import { writeFile } from 'node:fs/promises'
import type { IPkgs } from '@truth-cli/shared'
import { entries } from '@truth-cli/shared'
import type { IContext } from '../types.js'
import { genPkgs } from './pkgs.js'
import { genRelations } from './relations.js'

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

function loadTreeFile(pkgs: IPkgs, tabCount: number, ctx: IContext) {
  if (!pkgs)
    return
  const { dealNewLine, push } = ctx
  dealNewLine(tabCount)
  for (const [name, { packages, version }] of entries(pkgs)) {
    dealNewLine(tabCount, true)
    push(`${name} ${version}`)
    loadTreeFile(packages, tabCount + 1, ctx)
  }
  dealNewLine(tabCount)
}

export async function genPkgTree(maxDep: number) {
  await genRelations()
  const { name, version, packages } = genPkgs(maxDep)
  const ctx = createContext()
  ctx.push(`${name} ${version}:`)
  loadTreeFile(packages, 0, ctx)
  ctx.dealEnd()
  await writeFile('treePkgs.txt', ctx.source)
}
