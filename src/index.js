import Vue from 'vue'
import App from './components/App'
import dotenv from 'dotenv'

dotenv.config()

console.log('index.js', process.env)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
}).$mount('#app')
