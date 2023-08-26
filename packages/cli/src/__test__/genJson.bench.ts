import { bench } from 'vitest'
import { genFile } from '../file'

bench('生成 json 文件', () => {
  genFile(1, 'json', './')
}, { time: 15 })
