import { bench } from 'vitest'
import { genFile } from '../file'

bench('File json', () => {
  genFile(1, 'json', './')
}, { time: 15 })
