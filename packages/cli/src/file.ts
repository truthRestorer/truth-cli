import path from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logError, logFinished } from './const.js'
import type { FileType } from './types.js'

// 写入文件
export async function genFile(depth: any, type: FileType, p: string) {
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
      const { brotliDecompressSync } = await import('node:zlib')
      const html = brotliDecompressSync(brHTML).toString()
      const { genBaseRelation } = await import('@truth-cli/core/node')
      writeFileSync(
        writePath,
        // 需要将原有文件中的 fetch API 修改为 Reponse 对象
        html.replace(
          'fetch("base.json")',
          `new Response('${JSON.stringify(genBaseRelation()).replace(/\\/g, '/')}')`,
        ).replace(
          'fetch("relations.json")',
          `Promise.resolve(new Response('${JSON.stringify(relations).replace(/\\/g, '/')}'))`,
        ),
      )
    }
    logFinished(Date.now() - begin, writePath)
  }
  catch (err: any) {
    logError(err.message)
  }
}
