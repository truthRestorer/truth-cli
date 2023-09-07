import { bench } from 'vitest'
import { genFile } from '../file'

bench('生成 txt 文件', async () => {
  await genFile(1, 'txt', './')
}, { time: 15 })
