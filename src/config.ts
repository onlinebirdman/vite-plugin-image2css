import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  cdn: {
    enable: false,
    projectName: 'common'
  },
  constants: {
    CDN_URL_FILENAME: 'cdnUrls.lock.json',
    CSS_OUTPUT_NAME: '_image2css.css',
    CSS_OUTPUT_DIR: path.resolve(__dirname, './.dev/_image2css.css'),
    MODULE_ID: 'virtual:image2css',
    WATCHING_DIR: './src/assets/imgs'
  }
}
