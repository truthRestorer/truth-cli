import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/drawer/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.mount('#app')
