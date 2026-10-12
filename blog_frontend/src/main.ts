import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import './styles/tokens.css'
import './styles/highlight.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
