import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import './styles/main.css'
import 'floating-vue/dist/style.css'
import App from './App.vue'
import initializeRouter from './router'

const app = createApp(App)

initializeRouter(app)

app.use(FloatingVue)
app.mount('#app')
