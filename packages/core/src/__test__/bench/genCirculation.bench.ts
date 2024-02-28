import { bench } from 'vitest'
import { genCirculation } from '../../circulation'

bench('API genCirculation', () => {
  genCirculation({
    __extra__: {},
    __root__: {
      version: '1.0.0',
      dependencies: {
        axios: '0.0.1',
        vite: '3.0.0',
      },
      devDependencies: {
        vue: '3.0.0',
        '@truth-cli/core': '1.0.0',
      },
    },
  })
}, { time: 1000 })
