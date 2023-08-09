import { createApp } from 'vue'
import './style.css'
import JsonViewer from 'vue-json-viewer'
import App from './App.vue'

const app = createApp(App)

app.use(JsonViewer)
app.mount('#app')
