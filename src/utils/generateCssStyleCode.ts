/**
 *
 * @param classname string [path]/filename.png => .filename
 * @param templateData @type StyleTemplateData
 * @returns .filename { [styleCode] }
 */
function generateCssStyleCode (templateData: StyleTemplateData): string {
  const prefix = 'img'
  const { width, height, filePath, name, classname } = templateData
  const DEFAULT_TEMPLATE = `
    .${prefix}-${classname} {
      width: ${width}px;
      height: ${height}px;
      display: inline-block;
      position: relative;
      background-image: url('${filePath}');
      background-size: ${width}px ${height}px;
      background-position: 0 0;
      background-repeat: no-repeat;
      box-sizing: border-box;
    }
  `
  return DEFAULT_TEMPLATE
}


export default generateCssStyleCode