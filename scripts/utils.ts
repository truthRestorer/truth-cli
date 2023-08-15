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

export async function buildWeb(options: { isDeploy?: boolean; buildPath: string; root?: string; configFile?: string }) {
  let { isDeploy, buildPath, root, configFile } = options
  if (!configFile)
    configFile = path.resolve(__dirname, '../vite.config.ts')
  if (!root)
    root = path.resolve(__dirname, '../packages/web')
  const buildBaseOpt: InlineConfig = {
    configFile,
    root,
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
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: vitePath,
    server: { port },
  })

  return server
}
