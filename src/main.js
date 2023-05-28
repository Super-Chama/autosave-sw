import '@ohrm/oxd/fonts.css'
import '@ohrm/oxd/icons.css'
import '@ohrm/oxd/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
