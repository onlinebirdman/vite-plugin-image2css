import fastGlob from 'fast-glob'
/**
 *
 * @param targetDir 目标目录 [path]/[dir]
 * @returns filepaths [./a/[path]/[filename-a].[ext], ./a/[path]/[filename-b].[ext]]
 */
async function findImages (targetDir: string): Promise<string[]> {
  const patterns = [`${targetDir}/**/*.{png,jpg,jpeg,gif}`] // 支持的图片扩展名
  try {
    const images = await fastGlob(patterns, { dot: false })
    return images
  } catch (err) {
    console.error('Error while searching for images:', err)
    throw err
  }
}


export default findImages