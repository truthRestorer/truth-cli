import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const webPath = path.resolve(__dirname,'../packages/web/')

;(async () => {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: `${webPath}/vite.config.ts`,
    root: webPath,
  })
  await server.listen()

  server.printUrls()
})()
