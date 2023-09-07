import path from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { brotliDecompressSync } from 'node:zlib'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logError, logFinished } from './const.js'

// 写入文件
export async function genFile(depth: any, type: 'json' | 'txt' | 'html', p: string) {
  try {
    depth = Number(depth)
    if (Number.isNaN(depth))
      throw new TypeError('illegal type of depth')
    const begin = Date.now()
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'json') {
      const { genJson } = await import('@truth-cli/core')
      writeFileSync(writePath, JSON.stringify(genJson(depth, relations)))
    }
    else if (type === 'txt') {
      const { genTxt } = await import('@truth-cli/core')
      writeFileSync(writePath, genTxt(depth, relations))
    }
    else {
      const brHTML = readFileSync(htmlPath)
      const html = brotliDecompressSync(brHTML).toString()
      writeFileSync(
        writePath,
        html.replace('fetch("relations.json")', `new Response('${JSON.stringify(genRelations())}')`),
      )
    }
    logFinished(Date.now() - begin, writePath)
  }
  catch (err: any) {
    logError(err.message)
  }
}
