import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/css/magic.css'

import { createPinia } from "pinia" //状态管理
import piniaPluginPersistedstate  from 'pinia-plugin-persistedstate'
import router from './router/index' //路由

import ElementPlus from 'element-plus' 
import 'element-plus/dist/index.css' 
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //图标

import MavonEditor from 'mavon-editor' //markdown
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
    .use(MavonEditor)
    .use(pinia)
    .use(router)
    .mount('#app')
