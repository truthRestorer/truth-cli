import { bench } from 'vitest'
import { genFile } from '../file'

bench('生成 txt 文件', () => {
  genFile(1, 'txt', './')
}, { time: 15 })
