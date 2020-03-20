/**
 * 虚拟数据的mock公共方法
 */
export const ProcessDatas = {
  methods: {
    _mockDatas () {
      let data = this.$Mock.mock({
        // 属性 list 的值是一个数组  'name|1' 表示随机选取 1 个元素，作为最终值 'name|+1' 表示按顺序选取 1 个元素，作为最终值
        'list|5': [{
          'originalTable|+1': [
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '第13条数据测试数据测试数据',
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100)
          ],
          'schedule|+1': [
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '',
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '第13条数据测试数据测试数据',
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '',
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '测试数据测试数据' + Math.round(Math.random() * 100),
            '',
            '测试数据测试数据' + Math.round(Math.random() * 100)
          ],
          'value|500-100000': 25
        }]
      })
      // 输出结果
      console.log(data.list)
      return data.list
    }
  },
  mounted () {
    // 解决echarts图表双击下钻销毁重建的浏览器监听报错
    window.removeEventListener('resize', () => {
      // this.myChart.resize()
    })
    window.addEventListener('resize', () => {
      // this.myChart.resize()
    })
  },
  destroyed () {
    // 清除定时器,最优化放在这里 无论是删除原件还是跳转到其他页面
    this.$EventBus.$off()
  },
  watch: {
    // 监听路由地址
    '$route.path' (newval, oldval) {
      console.log(newval, oldval)
    },
    // to , from 分别表示从哪跳转到哪，都是一个对象
    // to.path  ( 表示的是要跳转到的路由的地址 eg: /home )
    $route (to, from) {
      console.log(to, from)
    }
  }
}
