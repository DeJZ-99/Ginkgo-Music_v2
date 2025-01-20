import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/[name].js',
          assetFileNames(assetInfo) {
            if (assetInfo.name?.endsWith('.css')) return 'css/[name].css'
            if (
              ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].some((ext) =>
                assetInfo.name?.endsWith(ext)
              )
            ) {
              return 'imgs/[name].[ext]'
            }
            return 'assets/[name].[ext]'
          }
        }
      }
    },
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/renderer/src/assets/style.less')}";`
          }
        }
      }
    },
    server: {
      proxy: {
        '/search': {
          target: 'http://songsearch.kugou.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/search/, '')
        },
        '/play': {
          target: 'https://www.hhlqilongzhu.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/play/, '')
        },
        '/hotmsg': {
          target: 'http://mobilecdnbj.kugou.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hotmsg/, '')
        },
        '/rank': {
          target: 'https://m.kugou.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rank/, '')
        },
        '/pic': {
          target: 'https://openapicdnretry.kugou.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pic/, '')
        }
      }
    }
  }
})
