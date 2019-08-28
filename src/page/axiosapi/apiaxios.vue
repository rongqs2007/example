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
import { getExample } from '../../api/index'
export default {
  name: 'ApiAxios',
  methods: {
    _getApi () {
      getExample().then((res) => {
        console.log(res)
      })
    }
  },
  mounted () {
    this._getApi()
  },
  created () {
    this.$axios('http://192.168.0.12:8085/psy-query')
      .then(res => {
        console.log(res)
      })
  }
}
</script>

<style>

</style>
