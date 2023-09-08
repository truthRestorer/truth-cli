import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bench } from 'vitest'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

bench('读取压缩文件', () => {
  readFileSync(path.resolve(__dirname, './index.html.br'))
}, { time: 30 })

bench('读取未压缩文件', () => {
  readFileSync(path.resolve(__dirname, './index.html'))
}, { time: 30 })
