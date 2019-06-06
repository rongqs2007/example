<template>
  <div class="layout">
    <Layout>
      <Header>Header</Header>
      <Content class="scrollDiv" :style="{overflow: 'auto'}">
        <div class="example scrollBarWidth">
          返回的滚动条宽度：{{ scrollbarWidth }}
        </div>
        <div class="example scrollBarWidth">
          数组从大到小的排列：{{ arrA }}
        </div>
        <div class="example scrollBarWidth">
          数组从小到大的排列：{{ arrB }}
        </div>
        <ul>
          <li v-for="(item, index) in this._mockDatas()" :key="index">{{ item.originalTable }}</li>
        </ul>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  </div>
</template>

<script>
import { ProcessDatas } from '../mixins/index'
import { _scrollbarWidth, maxSort, minSort } from '../utils/offset'
export default {
  name: 'HomePage',
  mixins: [ProcessDatas],
  components: {
  },
  data () {
    return {
      scrollbarWidth: _scrollbarWidth(),
      arr1: [10, 90, 20, 40, 80, 30, 200],
      arr2: [10, 90, 20, 40, 80, 30, 200],
      arrA: [],
      arrB: []
    }
  },
  methods: {
    _getMax () {
      this.arrA = maxSort(this.arr1)
    },
    _getMin () {
      this.arrB = minSort(this.arr2)
    }
  },
  mounted () {
    this._getMax()
    this._getMin()
  },
  created () {
  }
}
</script>

<style scoped>
/** scrollDiv有底的时候高度值  下面的媒体查询在没有底的时候还需要重新再次查询重新定义新值 **/
.scrollDiv{
  width: 100%;
  height: 86vh;
}
@media screen and (min-width: 1440px) and (max-width: 1679px) {
  .scrollDiv{
    height: 83vh;
  }
}
@media screen and (width: 1366px) {
  .scrollDiv{
    height: 87vh;
  }
}
@media screen and (min-width: 1151px) and (max-width: 1280px)  {
  .scrollDiv{
    height: 84vh;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1150px)  {
  .scrollDiv{
    height: 80vh;
  }
}
.example{
  font-size: 16px;
  padding: 20px;
  border-bottom: 2px solid #fff;
}
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
