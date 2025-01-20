import './assets/style.less'
import './assets/iconfont/iconfont.css'

import { createApp } from 'vue'
import App from './App.vue'

// 引入路由
import router from './router/index'
// 引入pinia
import { createPinia, Pinia } from 'pinia'
const pinia: Pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
