import minimist from 'minimist'
import { genPkgsAndWeb } from '../lib/index.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))

genPkgsAndWeb({
  isDev: true,
  treeDep: argv.dep ?? 2,
  pkgDep: 2,
  isWeb: false
})
