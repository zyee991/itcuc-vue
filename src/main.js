import Vue from 'vue'
import App from './App.vue'
import "jquery"
import "popper.js"
import "bootstrap"
import "axios"

import axios from 'axios'
import VueAxios from 'vue-axios'

import "bootstrap/dist/css/bootstrap.css"

Vue.use(VueAxios,axios);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
