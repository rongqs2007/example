import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import BaiduMap from 'vue-baidu-map'

import axios from 'axios'
import ViewUI from 'view-design'
import Mock from 'mockjs'
// 引入 ECharts 主模块
import echarts from 'echarts'

import moment from 'moment' // 日期格式js

import MapApi from './common/mapApi'

import 'view-design/dist/styles/iview.css'
import '../src/assets/globalCSS.css'

// 使用插件
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '4GKOZZCm6mjrjBFzrjFPoqwSMtwQcvIs'
})
Vue.use(ViewUI)

// 使用插件
Vue.component(MapApi.name, MapApi)

// 绑定axios到原型实现全局调用
Vue.prototype.$axios = axios
Vue.prototype.$Mock = Mock
Vue.prototype.$echarts = echarts
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$moment = moment // 赋值使用 就是调用一下
 
moment.locale('zh-cn') // 这里是进行了汉化

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
