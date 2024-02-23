import chokidar from 'chokidar'
import chalk from 'chalk'
import image2css from './image2css'
import config from '../config'
import path from 'path'
import ctx from '../context'
import fs from 'fs-extra'
export default async function watcher (watchingDir) {
  function isImageFile (filename) {
    const regex = /\.(jpg|jpeg|png|gif|bmp)$/i
    return regex.test(filename)
  }
  let timer
  // 1000ms内最多执行1次，有多次时只执行最后一次
  const locker = (timeout) => {
    clearTimeout(timer)
    return new Promise((resolve) => {
      timer = setTimeout(resolve, timeout)
    })
  }

  async function cb (type, filePath) {
    if (!isImageFile(filePath)) return
    await locker(1000)
    image2css(watchingDir)
  }
  try {
    const watcher = chokidar.watch(watchingDir, {
      // ignored: /^(?!.*\.(jpg|jpeg|png|gif|bmp)$).*/i,
    })
    watcher.on('all', cb)

    // console.log(chalk.green('image2css is watching on: ' + watchingDir))
  } catch (error) {
    console.log(chalk.red(JSON.stringify({ error })))
  }
}

export const getWatchingDir = () => {
  const { dir } = ctx.pluginOptions
  const watchingDir = path.resolve(process.cwd(), dir || config.constants.WATCHING_DIR)
  fs.ensureDirSync(watchingDir)
  return watchingDir
}
