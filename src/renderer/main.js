import db from './datastore'
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import { AsyncDataPlugin } from 'vue-async-data-2'

Vue.use(AsyncDataPlugin)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
Vue.prototype.$db = db
