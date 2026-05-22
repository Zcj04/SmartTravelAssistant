import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import routers from './router'
import './styles/common.css'

const app = createApp(App)
app.use(Vant)
app.use(routers)
app.mount('#app')



