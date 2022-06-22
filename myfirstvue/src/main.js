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


const pinia = createPinia().use(PiniaSocketPlugin)
const app = createApp(App)

app.use(pinia)
app.use(Quasar)
app.mount('#app')



//App.use(VueSocketIO, socketio('http://localhost/socket.io'), store);


