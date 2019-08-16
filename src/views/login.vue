<template>
  <div class="login">
    <div class="nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/login">登录</router-link>
      <router-link to="/person">个人中心</router-link>
    </div>
    <Input v-model="username" placeholder="admin" style="width: 300px" />
    <Button type="warning" @click="login">登录</Button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.username).then(data => {
        this.$router.push({
          path: '/person'
        })
      })
    }
  }
}
</script>

<style>

</style>
