// Vue imports
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueRouter from "vue-router"

// Tools
import App from './App.vue'
import Router from "./vue/Router"
import Store from "./vue/Store"

// Third party
import axios from 'axios'
import "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

// Configuration
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
export const bus = new Vue()

// Bootstrap
new Vue({
  render: h => h(App),
  router: Router,
  store: Store,
}).$mount('#app')
