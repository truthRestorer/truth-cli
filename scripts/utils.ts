import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ModuleFormat } from 'rollup'
import type { InlineConfig } from 'vite'
import { build, createServer } from 'vite'
import plugins from './plugins.js'

export const __scriptName = fileURLToPath(new URL('.', import.meta.url))

export async function buildOptions() {
  const dirs = await fs.readdir(path.resolve(__scriptName, '../packages/'))
  const opts: { [key: string]: any } = {}
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] !== 'web') {
      opts[dirs[i]] = [{
        input: path.resolve(__scriptName, `../packages/${dirs[i]}/index.ts`),
        plugins,
      }, {
        dir: path.resolve(__scriptName, `../packages/${dirs[i]}/dist`),
        format: 'es' as ModuleFormat,
      }]
      if (dirs[i] === 'cli')
        opts.cli[1].banner = '#! /usr/bin/env node'
    }
  }
  return opts
}

export async function buildWeb(options: { isDeploy?: boolean; buildPath: string }) {
  const { isDeploy, buildPath } = options
  const buildBaseOpt: InlineConfig = {
    configFile: path.resolve(__scriptName, '../vite.config.ts'),
    root: path.resolve(__scriptName, '../packages/web'),
    base: './',
    build: {
      outDir: buildPath,
    },
  }
  if (!isDeploy) {
    buildBaseOpt.build!.copyPublicDir = false
    buildBaseOpt.build!.emptyOutDir = true
  }
  await build(buildBaseOpt)
}

export async function createViteServer(vitePath: string, port: number = 1337) {
  const server = await createServer({
    configFile: path.resolve(__scriptName, '../vite.config.ts'),
    root: vitePath,
    server: { port },
  })

  return server
}
