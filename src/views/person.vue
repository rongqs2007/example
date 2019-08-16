<template>
  <div class="persom">
    <div class="nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/login">登录</router-link>
      <router-link to="/person">个人中心</router-link>
    </div>
    个人中心: {{ this.$store.state.username }}
  </div>
</template>

<script>
export default {
  name: 'Person'
}
</script>

<style>

</style>
