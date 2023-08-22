import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";


export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    visualizer({open: true}),//打包后增加state.html
    viteCompression({ //压缩文件
      threshold:5120 //大于5K文件压缩
    }),
    importToCDN({
      prodUrl: 'https://unpkg.com/{name}@{version}/{path}',
      modules: [
        // autoComplete('vue'),
        {
          name: 'vue',
          var: 'Vue',
          path: `dist/vue.global.prod.js`,
          version:'3.3.4'
        },
        {
          name: 'vue-demi',
          var: 'VueDemi',
          path: `lib/index.iife.js`,
          version:'0.13.11'
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          version:'2.3.9',
          path: 'dist/index.full.min.js',
          css:'dist/index.css'
        },
        {
          name: '@element-plus/icons-vue',
          var: 'ElementPlusIconsVue',
          path: 'dist/index.iife.min.js',
          version: '2.1.0', // 指定版本号
        },
        {
          name: 'mavon-editor',
          var: 'MavonEditor', //
          version:'3.0.1',
          path: 'dist/mavon-editor.js',
          css:'dist/css/index.css'
        },
        {
          name: 'vue3-emoji-picker',
          var: 'EmojiPicker',
          version:'1.1.7',
          path: 'dist/emoji-picker.umd.js',
          css:'dist/style.css'
        },
        {
          name: 'echarts',
          var: 'echarts',
          version:'5.4.2',
          path: '/dist/echarts.min.js',
        },
        {
          name: 'echarts-wordcloud',
          var: 'echarts-wordcloud',
          version:'2.1.0',
          path: 'dist/echarts-wordcloud.min.js',
        },
      ],
    }),
    vue(),
  ],
})
