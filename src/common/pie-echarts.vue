<template>
  <div class="pieBox">
    <div ref="pieChart" :id="pieObj.id" style="width: 100%;height: 400px;"></div>
  </div>
</template>

<script>

export default {
  name: 'PieEcharts',
  props: {
    pieObj: Object
  },
  data () {
    return {
      pieCenter: null,
      pieChart: null,
      option: null
    }
  },
  methods: {
    _initEcharts () {
      let _this = this
      if (_this.pieChart !== null) {
        _this.pieChart.dispose()
      }
      // 初始化图表设置
      let option = {
        tooltip: {
          padding: 10,
          formatter: function (param) {
            // console.log(param)
            return param.seriesName + '</br>' + param.name + ' : ' + param.value + '%'
          }
        },
        legend: {
          left: 'center',
          bottom: '20px',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 10,
          icon: 'rect',
          data: _this.pieObj.citys,
          type: _this.pieObj.citys.length > 12 ? 'scroll' : 'plain'
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '5%',
          bottom: '25%',
          containLabel: true
        },
        series: [
          {
            name: '接种量占比',
            type: 'pie',
            radius: [0, '75%'],
            center: ['50%', this.pieCenter],
            hoverAnimation: false,
            data: _this.pieObj.datas,
            label: {
              show: false,
              position: 'inside',
              formatter: '{d}%',
              fontSize: 12
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: function (params) {
                  return _this.pieObj.color[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      _this.option = option
      _this.pieChart = _this.$echarts.init(document.getElementById(_this.pieObj.id))
      _this.pieChart.setOption(option)
      // 改变浏览器窗口的时候图形跟随容器大小改变自适应
      window.removeEventListener('resize', () => {
        this.pieChart.resize()
      })
      window.addEventListener('resize', () => {
        this.pieChart.resize()
      })
    }
  },
  mounted () {
    // 获取不同分辨率下饼图居于顶部位置不变
    let _width = window.screen.width
    if (_width === 1920) {
      this.pieCenter = 160
    } else if (_width === 1680 || _width === 1600) {
      this.pieCenter = 130
    } else if (_width === 1440 || _width === 1366) {
      this.pieCenter = 110
    } else if (_width === 1280 || _width === 1152 ) {
      this.pieCenter = 100
    } else if (_width === 1024) {
      this.pieCenter = 70
    }
    this._initEcharts()
  },
  created () {
  },
  watch: {
    'pieObj.datas' () {
      this._initEcharts()
    }
  }
};
</script>

<style scoped>

</style>
