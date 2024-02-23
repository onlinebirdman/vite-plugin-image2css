import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Image2css from '../src/index'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Image2css({
      dir: './src/assets/images',
      cdn: {
        enable: process.env.NODE_ENV === 'production'
      }
    })
  ]
})
