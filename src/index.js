import { ipcRenderer } from 'electron'
import Vue from 'vue'
import App from './components/App'
import dotenv from 'dotenv'
import vClickOutside from 'v-click-outside'

ipcRenderer.on('updater-message', function(event, text) {
  console.log(text)
})

Vue.use(vClickOutside)

dotenv.config()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
}).$mount('#app')
