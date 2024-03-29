import scanner from './scanner'
import * as cdnPlugin from './cdn'
import generateCssContent from './generateCssContent'
import chalk from 'chalk'
import config from '../config'
import fs from 'fs-extra'
import ctx from '../context'
import path from 'path'
// css文件输出位置
export const getOutputCssFilePath = () => {
  const { command } = ctx.pluginConfig
  // 这是项目目录下的输出路径
  const cssFilePath = path.resolve(process.cwd(), `./.dev/.image2css/${command}/_image2css.css`)
  // 这是依赖目录下的输出路径
  fs.ensureFileSync(cssFilePath)
  return cssFilePath
}
export default async (targetDir) => {
  if (!targetDir) return console.log(chalk.red('请输入目标目录targetDir'))
  // if (!targetDir) return console.log('请输入目标目录targetDir')
  // 扫描目录
  const images = await scanner(targetDir)
  // 处理上传cdn
  if (config.cdn.enable) {
    const listToUpload = []
    const cdnUrlMap = cdnPlugin.getCdnUrlMap()
    images.forEach(image => {
      if (!cdnUrlMap.has(image.hash)) {
        listToUpload.push(image)
      }
    })
    await cdnPlugin.upload(listToUpload, config.cdn.projectName, targetDir)
  }

  // 生成css文件内容

  const cssFileContent = generateCssContent(images)
  // 输出css文件
  const cssOutputFilePath = getOutputCssFilePath()
  fs.writeFileSync(cssOutputFilePath, cssFileContent)
}
