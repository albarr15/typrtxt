import { createApp, onMounted } from 'vue'
import App from './App.vue'
import './assets/css/style.css'
import { themeChange } from 'theme-change'

export default {
  setup() {
    onMounted(() => {
      themeChange(false)
    })
  },
}

createApp(App).mount('#app')
