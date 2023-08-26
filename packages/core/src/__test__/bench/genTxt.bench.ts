import { bench } from 'vitest'
import { genTxt } from '../../txt'

bench('API genTxt', () => {
  genTxt(1, {
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
