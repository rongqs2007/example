import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import axios from 'axios'
import iView from 'iview'
import Mock from 'mockjs'

import 'iview/dist/styles/iview.css'
import '../src/assets/globalCSS.css'

// 使用插件
Vue.use(iView)

// 绑定axios到原型实现全局调用
Vue.prototype.$axios = axios
Vue.prototype.$Mock = Mock

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
