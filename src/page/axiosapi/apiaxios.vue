<template>
  <div class="apiAxios">
    <div class="nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/login">登录</router-link>
      <router-link to="/person">个人中心</router-link>
    </div>
  </div>
</template>

<script>
import { getTest } from '../../api/index'
export default {
  name: 'ApiAxios',
  methods: {
    _getApi () {
      getTest().then((res) => {
        console.log(res)
      })
    }
  },
  mounted () {
    this._getApi()
  }
}
</script>

<style>

</style>
