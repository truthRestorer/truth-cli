import { bench } from 'vitest'
import { genFile } from '../file'

bench('json file', () => {
  genFile(1, 'json', './')
}, { time: 15 })
