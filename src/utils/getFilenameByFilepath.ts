/**
 *
 * @param filePath [path]/[filename].[ext]
 * @returns filename
 */
function getFilenameByFilepath (filePath) {
  const fileNameMatch = filePath.match(/[^/\\]+(?=\.[^.]+$)/)
  const fileNameWithoutExtension = (fileNameMatch && fileNameMatch[0]) || ''
  return fileNameWithoutExtension
}

export default getFilenameByFilepath