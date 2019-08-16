import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/page/HomePage'
import ApiAxios from '@/page/axiosapi/apiaxios'
import Login from '@/views/login'
import Home from '@/views/home'
import Person from '@/views/person'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/apiaxios',
      name: 'ApiAxios',
      component: ApiAxios
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/person',
      name: 'Person',
      component: Person,
      meta: { needLogin: true } // 自己增加的备注
    }
  ]
})
