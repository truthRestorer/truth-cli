import { bench } from 'vitest'
import { genFile } from '../file'

bench('txt file', () => {
  genFile(1, 'txt', './')
}, { time: 15 })
