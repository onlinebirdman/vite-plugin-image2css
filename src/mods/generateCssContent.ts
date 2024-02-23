import { getCdnUrlMap } from './cdn'
import config from '../config'
/**
 *
 * @param classname string [path]/filename.png => .filename
 * @param templateData @type StyleTemplateData
 * @returns .filename { [styleCode] }
 */
function generateCssContent (image): string {
  const prefix = 'img'
  const { width, height } = image
  const DEFAULT_TEMPLATE = `
    .${genClassName(image)} {
      width: ${width}px;
      height: ${height}px;
      display: inline-block;
      position: relative;
      background-image: url('${genUrl(image)}');
      background-size: ${width}px ${height}px;
      background-position: 0 0;
      background-repeat: no-repeat;
      box-sizing: border-box;
    }
  `
  return DEFAULT_TEMPLATE
}
function genClassName ({ filePath }) {
  const prefix = 'img'
  // TODO: 只是简单处理，还需要优化
  const name = filePath.split('.')[0].split('/').pop()
  return `${prefix}-${name}`
}
function genUrl (image) {
  const isCdn = config.cdn.enable
  if (isCdn) {
    const cdnUrlMap = getCdnUrlMap()
    return cdnUrlMap.get(image.hash)
  } else {
    return image.filePath
  }
}
export default (images: any[]):string => {
  const cssFileContent = images.map((image) => {
    return generateCssContent(image)
  }).join('')
  return cssFileContent || ''
}
