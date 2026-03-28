import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Toast notification
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// Bootstrap Icons
const link = document.createElement('link')
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
link.rel = 'stylesheet'
document.head.appendChild(link)

const app = createApp(App)

app.use(router)
app.use(ToastPlugin, {
    position: 'top-right',
    duration: 3000,
})

app.mount("#app")
