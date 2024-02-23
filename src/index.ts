import type Plugin from 'vite'
import config from './config'
import image2css, { getOutputCssFilePath } from './mods/image2css'
import watcher, { getWatchingDir } from './mods/watcher'
import ctx from './context'
import chalk from 'chalk'
interface PluginOptions {
  /** 监听的文件目录 */
  dir?: string,
  /** cdn功能 */
  cdn?: {
    /** cdn开关 */
    enable: boolean,
    /** cdn项目名 */
    projectName: string
  }
}
export let watchingDir = ''
export const pluginOptions = {}
export const pluginResolveConfig = {}
export default (options?: PluginOptions):Plugin => {
  const virtualModuleId = config.constants.MODULE_ID
  console.log(chalk.green('image2css in running...'))
  return {
    name: 'vite-plugin-image2css', // 此名称将出现在警告和错误中
    resolveId (id) {
      if (id === virtualModuleId) {
        return getOutputCssFilePath()
      }
      return null
    },
    async config (userConfig, resolvedConfig) {
      console.time('image2css ready in')
      ctx.create(options, resolvedConfig)
      const { command } = resolvedConfig
      const { cdn } = options || {}
      // 解析参数选项
      if (cdn) {
        config.cdn.enable = cdn.enable
      } else {
        config.cdn.enable = false
      }

      // 计算监听目录
      watchingDir = getWatchingDir(resolvedConfig, options)

      if (command === 'build') {
        // 执行打包命令时，直接等待文件生成
        await image2css(getWatchingDir(resolvedConfig, options))
      } else {
        watcher(getWatchingDir(resolvedConfig, options))
      }

      console.timeEnd('image2css ready in')
    }
  }
}
