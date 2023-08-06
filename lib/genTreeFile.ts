import fs from 'node:fs/promises'
import type { IPkgs } from '@truth-cli/shared'
import { entries } from '@truth-cli/shared'
import { genPkgs } from './genFile/pkgs.js'
import { genRelations } from './genFile/relations.js'

enum ESymbol {
  TAB = ' ',
  VERTICAL = '│',
  ADD = '├─',
  LINE = '\n',
}
let source = ''

function push(symbol: string) {
  source += symbol
}

function loadTreeFile(pkgs: IPkgs | undefined, tabCount: number) {
  if (!pkgs)
    return
  push(ESymbol.LINE)
  for (let i = 0; i < tabCount; i++) {
    push(ESymbol.VERTICAL)
    push(ESymbol.TAB.repeat(2))
  }
  push(ESymbol.VERTICAL)
  for (const [name, { packages, version }] of entries(pkgs)) {
    push(ESymbol.LINE)
    push(ESymbol.VERTICAL)
    for (let i = 0; i < tabCount; i++) {
      push(ESymbol.TAB.repeat(2))
      push(ESymbol.VERTICAL)
    }
    source = source.slice(0, source.length - 1)
    push(ESymbol.ADD)
    push(`${name} ${version}`)
    loadTreeFile(packages, tabCount + 1)
  }
}

export async function genTreeFile(maxDep: number) {
  await genRelations()
  const { name, version, packages } = genPkgs(maxDep)
  push(`${name} ${version}:`)
  loadTreeFile(packages, 0)
  await fs.writeFile('treePkgs.txt', source)
}
