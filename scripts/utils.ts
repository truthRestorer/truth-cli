import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { InlineConfig } from 'vite'
import { build, createServer } from 'vite'
import { genRelations } from '../packages/core/src/relations.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function buildWeb(buildPath: string, isZip = false) {
  const buildBaseOpt: InlineConfig = {
    configFile: path.resolve(
      __dirname,
      isZip ? '../vite.config.ts' : '../vite.config.noZip.ts',
    ),
    root: path.resolve(__dirname, isZip ? '../packages/web' : buildPath),
    base: './',
    build: {
      outDir: path.resolve(__dirname, `${buildPath}/dist`),
      copyPublicDir: !isZip,
      emptyOutDir: isZip,
    },
  }
  await build(buildBaseOpt)
}

export async function createViteServer(vitePath: string, port: number = 1337) {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: vitePath,
    server: { port },
  })
  await server.listen()
  server.printUrls()
}

/**
 * dev 环境或者 vercel 会用到
 */
export async function genWebFile(writePath: string) {
  const relations = genRelations()
  await fs.writeFile(`${writePath}/relations.json`, JSON.stringify(relations))
}
