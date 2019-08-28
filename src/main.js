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

// const whiteList = ['/']
// router.beforeEach(async (to, from, next) => { // 路由的渲染流程  钩子的执行顺序
//   // 要校验一下 当前用户登录没登录
//   if (whiteList.includes(to.path)) {
//     return next()
//   }
//   const flag = await store.dispatch('validate')
//   if (flag) {
//     if (to.path === '/login') {
//       next('/home')
//     } else {
//       next() // 登录过而且不是login  那就ok 跳转吧
//     }
//   } else {
//     // 没登录过 ，如果这条路由 还需要登录那么就跳转到登录页面
//     // 看vue文档
//     const flag = to.matched.some(item => item.meta.needLogin)
//     if (flag) {
//       next('/login')
//     } else {
//       next()
//     }
//   }
//   next()
// })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
