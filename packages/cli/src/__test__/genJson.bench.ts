import { bench } from 'vitest'
import { genFile } from '../file'

bench('生成 json 文件', async () => {
  await genFile(1, 'json', './')
}, { time: 15 })
