import { fileURLToPath } from 'url'
import path from 'path'
import type Plugin from 'vite'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import findImages from './utils/findImages'
import generateCssStyleCode from './utils/generateCssStyleCode'
import getFilenameByFilepath from './utils/getFilenameByFilepath'
import Jimp from 'jimp'
import * as cdnPlugin from './mods/cdn'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
let resolveWatchingDir = ''
const MODULE_ID = 'virtual:image2css'
const defaultOutputFile = './.dev/__image2css.css'
let defaultWatchingDir = './src/assets/imgs'

/**
 * 对目录进行初始化扫描
 * @param targetDir 目标目录
 */
async function initialScan (targetDir) {
  // console.log('initialScan:', targetDir)
  const useCDN = true
  const filesData = {}
  // 遍历targetDir下的所有图片，得到其文件路径
  const imageFilePaths = await findImages(targetDir)
  for (const index in imageFilePaths) {
    const filePath = imageFilePaths[index]
    const image = await Jimp.read(filePath)
    const { width, height } = image.bitmap
    const ext = image.getExtension()
    const name = getFilenameByFilepath(filePath) // 没有处理子文件夹问题
    const paths = filePath.split('/')
    // 计算路径
    const relativePath = path.relative(resolveWatchingDir, filePath)
    filesData[relativePath] = { 
      width,
      height,
      ext,
      name,
      paths,
      filePath: useCDN ? cdnPlugin.getCDNAssetUrl(filePath) : filePath,
      classname: getFilenameByFilepath(relativePath.replaceAll('/', '-'))
    }
  }
  await fs.outputJson(path.resolve(__dirname, './.dev/styleContentMap.json'), filesData, {
    spaces: 2,
  })

  // 文件写入记录
  const arr = []
  Object.entries(filesData).forEach(([, data]) => {
    arr.push(generateCssStyleCode(data))
  })
  await fs.outputFile(path.resolve(__dirname, defaultOutputFile), arr.join(''))
}
interface PluginOptions {
  dir: string
}
export default function image2css (options?: PluginOptions):Plugin {
  if (options?.dir) {
    defaultWatchingDir = options?.dir
  }
  const virtualModuleId = MODULE_ID
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-image2css', // 此名称将出现在警告和错误中
    resolveId (id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    async load (id) {
      if (id === resolvedVirtualModuleId) {
        const file = path.resolve(__dirname, defaultOutputFile)
        
        return `
          import "${file}"
        `
      }
    },
    configResolved (resolvedConfig) {
      const { root } = resolvedConfig
      console.log('ensureFileSync:', path.resolve(__dirname, defaultOutputFile))
      fs.ensureFileSync(path.resolve(__dirname, defaultOutputFile))
      resolveWatchingDir = path.resolve(root, defaultWatchingDir)
      const watcher = chokidar.watch(resolveWatchingDir, { ignored: /(^|[/\\])\../ })
      watcher
        .on('add', detectChange)
        .on('change', detectChange)
        .on('unlink', detectChange)
      let timer
      async function detectChange () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(async () => {
          initialScan(resolveWatchingDir)
        }, 1000)
      }
      // initialScan(resolveWatchingDir)
    },
  }
}
