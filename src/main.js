import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Default from './layout/wrapper/index.vue'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Bootstrap Icons
const link = document.createElement('link')
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
link.rel = 'stylesheet'
document.head.appendChild(link)

const app = createApp(App)

app.use(router)
app.component("default-layout", Default)

app.mount("#app")