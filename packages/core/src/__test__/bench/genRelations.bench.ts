import { bench } from 'vitest'
import { genRelations } from '../../relations'

bench('API genRelations', () => {
  genRelations()
}, { time: 15 })
