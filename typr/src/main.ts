import { createApp, onMounted } from 'vue'
import App from './App.vue'
import './assets/css/style.css'
import { themeChange } from 'theme-change'
import router from './router'

export default {
  setup() {
    onMounted(() => {
      themeChange(false)
    })
  },
}

createApp(App).use(router).mount('#app')
