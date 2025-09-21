import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import { createAppVuetify } from './plugins/vuetify'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createAppVuetify())

/**
 * Manual step note:
 * - Ensure Open Sans is loaded in index.html (already present).
 * - Place optional carousel images in public/assets as detection.jpg, tracking.jpg, response.jpg.
 */
app.mount('#app')
