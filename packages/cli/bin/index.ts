import process from 'node:process'
import { Command } from 'commander'
import { analyze } from '../lib/analyze'

const program = new Command()
program.name('dep-cli').description('hell world').version('0.8.0')
program
  .description('analyze npm packages')
  .option('-d, --dep <depth>', 'display just the first substring', '1')
  .option('-j, --json <file-path>', 'separator character', './')

program.parse(process.argv)
const options = program.opts()
const depth = +options.dep
if (depth < 7 && !Number.isNaN(depth))
  analyze(depth)
