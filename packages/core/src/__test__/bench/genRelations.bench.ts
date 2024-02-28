import { bench } from 'vitest'
import { genRelations } from '../../relations'

bench(
  'API genRelations',
  async () => {
    await genRelations()
  },
  { time: 15 },
)
