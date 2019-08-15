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

// 设置axios请求的token
axios.defaults.headers.common['token'] = 'f4c902c9ae5a2a9d8f84868ad064e706'
// 设置请求头
axios.defaults.headers.post['Content-type'] = 'application/json'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
