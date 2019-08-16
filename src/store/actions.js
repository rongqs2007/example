import { getLogin, getValidate } from '../api/index'

export default {
  // 全部是promise
  // login ({ commit }, username) {
  //   const r = getLogin(username)
  //   console.log(r)
  // }

  async login ({ commit }, username) {
    // 转为对象
    const r = await getLogin(username)
    console.log(r)
    if (r.code === 1) {
      return Promise.reject(r)
    }
    // 成功以后存储token
    localStorage.setItem('token', r.token)
    // commit提交一个方法 在mutation中的方法
    commit('setUsername', r.username)
  },

  async validate ({ commit }) {
    const r = await getValidate()
    if (r.code === 1) {
      return false
    }
    commit('setUsername', r.username)
    localStorage.setItem('token', r.token)
    return true
  }
}
