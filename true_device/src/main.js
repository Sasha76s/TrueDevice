import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import authStore from './authStore.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

authStore.initAuth()
