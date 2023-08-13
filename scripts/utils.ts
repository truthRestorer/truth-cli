import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ModuleFormat } from 'rollup'
import type { InlineConfig } from 'vite'
import { build, createServer } from 'vite'
import plugins from './plugins.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function buildOptions() {
  const dirs = await fs.readdir(path.resolve(__dirname, '../packages/'))
  const opts: { [key: string]: any } = {}
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] !== 'web') {
      opts[dirs[i]] = [{
        input: path.resolve(__dirname, `../packages/${dirs[i]}/index.ts`),
        plugins,
      }, {
        dir: path.resolve(__dirname, `../packages/${dirs[i]}/dist`),
        format: 'es' as ModuleFormat,
      }]
      if (dirs[i] === 'cli')
        opts.cli[1].banner = '#! /usr/bin/env node'
    }
  }
  return opts
}

export async function buildWeb(options: { isDeploy?: boolean }) {
  const { isDeploy } = options
  const webBuildPath = isDeploy ? '../packages/web/dist' : '../packages/cli/dist'
  const buildBaseOpt: InlineConfig = {
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '../packages/web'),
    base: './',
    build: {
      outDir: path.resolve(__dirname, webBuildPath),
    },
  }
  if (!isDeploy) {
    buildBaseOpt.build!.copyPublicDir = false
    buildBaseOpt.build!.emptyOutDir = true
  }
  await build(buildBaseOpt)
}

export async function createViteServer() {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '../packages/web'),
    server: {
      port: 1337,
    },
  })

  return server
}
