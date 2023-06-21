import { createApp } from 'vue'
import App from './App.vue'
import { OhVueIcon } from "oh-vue-icons";

// add this
import './index.css'

const app = createApp(App)
app.component("v-icon", OhVueIcon);
app.mount('#app')
