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
        <div class="posGrid">
          <push-grid></push-grid>
        </div>
        <div class="posMap">
          <map-api></map-api>
        </div>
        <ul ref="listsUl">
          <li v-for="(item, index) in mockDatas" :key="index">{{ item.originalTable }}</li>
        </ul>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  </div>
</template>

<script>
import PushGrid from '../common/pushGrid'
import MapApi from '../common/mapApi'
import EventBus from '../utils/EventBus'
import { ProcessDatas } from '../mixins/index'
import { _scrollbarWidth, maxSort, minSort, createEleLi } from '../utils/offset'
export default {
  name: 'HomePage',
  mixins: [ProcessDatas],
  components: {
    PushGrid,
    MapApi
  },
  data () {
    return {
      mockDatas: [],
      scrollbarWidth: null,
      arr1: [10, 90, 20, 40, 80, 30, 200],
      arr2: [10, 90, 20, 40, 80, 30, 200],
      arrA: [],
      arrB: [],
      value: ''
    }
  },
  computed: {
  },
  methods: {
    // 调用动态创建的元素插入元素集合的第n位并设置内容及样式
    _createElement () {
      // 是否开启点击事件
      let flag = true
      // 插入所在父元素内子集合的最后一个位置
      let lastN = this._mockDatas().length
      let n = 0
      // 创建的标签名
      let TagName = 'li'
      // 被创建标签所在的父元素集合
      let parentID = this.$refs.listsUl
      // 标签里的内容
      let textContent = '被创建的li标签 将要被插入ul中'
      // 创建标签的样式定义
      let styles = {
        height: '30px',
        lineHeight: '30px',
        padding: '0 20px',
        fontSize: '16px',
        color: '#cff72f',
        cursor: 'pointer'
      }
      // 点击事件方法 对于操作创建的元素本身点击改变自身修饰时候需要在创建之前销毁
      EventBus.$on('onClick', (obj) => {
        styles.color = '#49ed14'
        textContent = '执行点击事件内容被改变'
        if (n >= lastN) {
          n = 0
        } else {
          n++
        }
        // 需要在创建之前销毁
        obj.remove()
        createEleLi(n, TagName, parentID, textContent, styles, flag)
        // 点击事件其他操作对象
        this.scrollbarWidth++
      })
      createEleLi(n, TagName, parentID, textContent, styles, flag)
    }
  },
  mounted () {
    this._createElement()
  },
  created () {
    // 初始化变量进行赋值,真实接口数据的话只需对对应的变量进行重新赋值即可
    // mock模拟数据
    this.mockDatas = this._mockDatas()
    // 滚动条宽度
    this.scrollbarWidth = _scrollbarWidth()
    this.arrA = maxSort(this.arr1)
    this.arrB = minSort(this.arr2)
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
.posMap{
  width: 70%;
  margin: 0 auto;
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
