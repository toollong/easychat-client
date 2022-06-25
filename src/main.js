import { createApp } from 'vue'
import { ElCollapseTransition } from 'element-plus'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import io from 'socket.io-client'
import VueParticles from 'vue-particles'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

import "@/mock/mockServer"
import "@/moment/moment"

import "@/assets/css/index.css"
import "element-plus/theme-chalk/el-message.css"
import "element-plus/theme-chalk/el-message-box.css"
import "element-plus/theme-chalk/el-loading.css"
import "element-plus/theme-chalk/base.css"

const app = createApp(App)

app.config.globalProperties.socket = io('http://localhost:9092', { transports: ['websocket'] })
app.component(ElCollapseTransition.name, ElCollapseTransition)
app.use(router)
app.use(store)
app.use(autoAnimatePlugin)
app.use(VueParticles)
app.mount('#app')
