import element from '@/plugins/element'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'

let app = createApp(App)
element(app)
app.use(router)
app.mount('#root')
