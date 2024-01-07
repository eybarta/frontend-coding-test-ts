import { createApp } from 'vue'
import Toast, { PluginOptions } from "vue-toastification";

import FloatingVue from 'floating-vue'
import './styles/main.css'
import "vue-toastification/dist/index.css";
import 'floating-vue/dist/style.css'
import App from './App.vue'
import initializeRouter from './router'

const app = createApp(App)

initializeRouter(app)

app.use(Toast);
app.use(FloatingVue)
app.mount('#app')
