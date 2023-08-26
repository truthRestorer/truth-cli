import { bench } from 'vitest'
import { genFile } from '../file'

bench('File txt', () => {
  genFile(1, 'txt', './')
}, { time: 15 })
