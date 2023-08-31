/* eslint-disable no-console */
import { genCirculation } from '@truth-cli/core'
import { relations } from './index.js'

const circulation = genCirculation(relations)
console.log(circulation)
