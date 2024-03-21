import findImages from '../utils/findImages'
import Jimp from 'jimp'
import path from 'path'
import fs from 'fs-extra'
import ctx from '../context'
import md5 from 'md5'
export default async (targetDirectory) => {
  const imageFilePaths = await findImages(targetDirectory)
  const result = []
  for (const index in imageFilePaths) {
    const filePath = imageFilePaths[index]
    // read image
    const image = await Jimp.read(filePath)
    const imageInfo = {
      filePath,
      hash: md5(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
      ext: image.getExtension(),
      size: image.bitmap.data.length
    }
    result.push(imageInfo)
  }
  fs.outputJsonSync(path.resolve(process.cwd(), `./.dev/.image2css/${ctx.pluginConfig.command}/images.json`), result, {
    spaces: 2
  })
  return result
}
