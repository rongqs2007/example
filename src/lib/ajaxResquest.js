/**
 * axios 封装请求  在api文件夹下创建一个方法调用下面的拦截器
 */

import axios from 'axios'

// let token = localStorage.getItem('token')
// axios.defaults.headers.common['token'] = token
// axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'

// 每个请求的拦截器方法可能不一样
// 用户请求设置的方法每次返回一个新的实例避免多次请求拦截
class AjaxRequest {
  constructor () {
    this.baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.0.12:8085/psy-query' : '/'
    this.timeout = 2000
  }
  // 用户请求设置的方法
  request (config) {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout
    })
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        // config.headers.Authorization = localStorage.getItem('token')
        return config
      },
      (err) => {
        Promise.reject(err)
      }
    )
    // 设置响应拦截器
    instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        Promise.reject(err)
      }
    )

    return instance(config)
  }
}

export default new AjaxRequest()
