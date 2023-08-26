import { bench } from 'vitest'
import { startWebServer } from '../server'

bench('启动网页', () => {
  startWebServer()
}, { time: 15 })
