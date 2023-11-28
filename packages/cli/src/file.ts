import path from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { brotliDecompressSync as brUnzip } from 'node:zlib'
import { genJson, genTxt } from '@truth-cli/core'
import { genRelations } from '@truth-cli/core/node'
import { htmlPath, logError, logFinished } from './const.js'
import type { FileType } from './types.js'

// 写入文件
export function genFile(type: FileType, p: string, depth: any) {
  try {
    const begin = Date.now()
    const relations = genRelations()
    const writePath = path.join(p, `pkgs.${type}`)
    if (type === 'html') {
      const html = brUnzip(readFileSync(htmlPath)).toString()
      writeFileSync(
        writePath,
        // 需要将原有文件中的 fetch API 修改为 Reponse 对象
        html.replace(
          'fetch("base.json")',
          `new Response('${JSON.stringify(relations).replace(/\\/g, '/')}')`,
        ),
      )
    } else {
      depth = Number(depth)
      if (Number.isNaN(depth)) throw new TypeError('illegal type of [depth]')
      if (type === 'json') {
        writeFileSync(writePath, JSON.stringify(genJson(depth, relations)))
      } else if (type === 'txt') {
        writeFileSync(writePath, genTxt(depth, relations))
      }
    }
    logFinished(Date.now() - begin, writePath)
  } catch (err: any) {
    logError(err.message)
  }
}
