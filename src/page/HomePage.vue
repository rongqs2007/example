<template>
  <div class="layout">
    <Layout>
      <Header>Header</Header>
      <Content>
        <ul>
          <li v-for="(item, index) in this._mockDatas()" :key="index">{{ item.originalTable }}</li>
        </ul>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  </div>
</template>

<script>
import { ProcessDatas } from '../mixins/index.js'
export default {
  name: 'HomePage',
  mixins: [ProcessDatas],
  mounted () {
    console.log(this.$store)
  }
}
</script>

<style scoped>
ul{
  padding: 20px;
}

li{
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  font-size: 16px;
}
.ivu-layout-header{
  background: #7cbce9;
  text-align: center;
  color: #fff;
}
.ivu-layout-content{
  background: #0f8de9;
  color: #fff;
}
.ivu-layout-footer{
  background: #7cbce9;
  text-align: center;
  color: #fff;
}
</style>
