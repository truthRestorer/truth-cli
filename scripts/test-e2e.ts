import path from 'node:path'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import colors from 'picocolors'
import { genRelations } from '../packages/core/node.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * FIXME: similar to genFile()
 */
async function e2e() {
  const htmlPath = path.resolve(__dirname, '../packages/cli/dist/index.html.br')
  if (!existsSync(htmlPath)) {
    console.log(colors.bgRed('请先运行 pnpm build'))
    return
  }
  const brHTML = readFileSync(htmlPath)
  const { brotliDecompressSync } = await import('node:zlib')
  const html = brotliDecompressSync(brHTML).toString()
  const writePath = path.resolve(__dirname, '../e2e/index.html')
  writeFileSync(
    writePath,
    html.replace(
      'fetch("relations.json")',
      `new Response('${JSON.stringify(genRelations())}')`,
    ),
  )
}

e2e()
