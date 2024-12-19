import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteSingleFile(),
  ],
  base: './', // 这里更改打包相对绝对路径
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist' // 修改打包路径
  },
  server: {
    proxy: {
      '/mywebtools/api': {
        target: 'http://127.0.0.1:3000',
      }
    },
    host: '0.0.0.0',
  }
})
