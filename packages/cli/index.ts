import { Command } from 'commander'
import { cleanFiles, genPkgTree } from '@truth-cli/core'
import {
  analyzeCommandWords,
  bothOptionWords,
  cleanCommandWords,
  depthOptionWords,
  description,
  filePathOptionWords,
  logDepthError,
  version,
} from '@truth-cli/shared'
import { genByCommand } from './src/index.js'

const program = new Command()
program
  .name('truth-cli')
  .description(description)
  .version(version)

program
  .command('analyze')
  .description(analyzeCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '3')
  .option('-j, --json [file-path]', filePathOptionWords)
  .option('-b, --both', bothOptionWords, false)
  .action(async ({ dep, json, both }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      await genByCommand({ dep: depth, isBoth: both, jsonPath: json })
    }
    catch (err) {
      logDepthError()
    }
  })

program
  .command('clean')
  .description(cleanCommandWords)
  .action(async () => {
    await cleanFiles()
  })

program
  .command('tree')
  .description(cleanCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '1')
  .action(async ({ dep }) => {
    const depth = +dep
    if (Number.isNaN(depth))
      throw new TypeError('illegal type of depth')
    await genPkgTree(+dep)
  })

program.parse()
