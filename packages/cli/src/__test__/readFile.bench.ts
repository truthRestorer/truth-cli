import { readFileSync } from 'node:fs'
import { bench } from 'vitest'

bench('读取未压缩文件', () => {
  readFileSync('e2e/index.html')
}, { time: 30 })

bench('读取压缩文件', () => {
  readFileSync('packages/cli/dist/index.html.br')
}, { time: 30 })
