import { bench } from 'vitest'
import { genJson } from '../../json'

bench('API genJson', () => {
  genJson(1, {
    __root__: {
      version: '1.0.0',
      dependencies: {
        axios: '0.0.1',
        vite: '3.0.0',
      },
      devDependencies: {
        'vue': '3.0.0',
        '@truth-cli/core': '1.0.0',
      },
    },
  })
}, { time: 1000 })
