import { createApp } from 'vue'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


// Import pinia stuff
import { createPinia } from 'pinia'

import { PiniaSocketPlugin } from './services/PiniaSocket.js'


import App from './App.vue'

/*
 * .js or .ts extension optional
 * */
import router from "./router";

const pinia = createPinia().use(PiniaSocketPlugin)
const app = createApp(App)

app.use(pinia)
app.use(Quasar)
app.use(router)
app.mount('#app')





