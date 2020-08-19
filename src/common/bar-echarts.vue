<template>
  <div class="barBox">
    <div :id="barObj.id" style="width: 100%;" :style="{height: _height}"></div>
  </div>
</template>

<script>
export default {
  name: 'BarEchart',
  props: {
    barObj: Object
  },
  data () {
    return {
      barChart: null,
      option: null
    }
  },
  computed: {
    isDetail () {
      // false
      return this.$store.state.isDetail
    },
    _height () {
      if (this.barObj.rotate) {
        return '900px'
      } else if (this.isDetail) {
        return '500px'
      } else {
        return '280px'
      }
    }
  },
  methods: {
    _initEcharts () {
      let _this = this
      if (_this.barChart !== null) {
        _this.barChart.dispose()
      }
      let _barObj = _this.barObj
      // 初始化图表设置
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: 10
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: _barObj.legend,
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          icon: 'rect'
        },
        grid: {
          left: '5%',
          right: '5%',
          top: _barObj.rotate ? '1%' : '10%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: _barObj.rotate ? 'value': 'category',
          // boundaryGap: false,
          splitLine: {
            show: _barObj.rotate ? true : false,
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            show: false
          },
          // 刻度标签文字的颜色
          axisLabel: {
            interval: _barObj.rotate ? 20 : 0,
            rotate: this.isDetail && !_barObj.rotate ? 0 : 45,
            color: '#666'
          },
          data: _barObj.rotate ? [] : _barObj.citys
        }
      }
    
      let yAxis = null
      if (_barObj.rotate) {
        yAxis = {
          type:  'category',
          splitLine: {
            show: false,
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            length: 0, // 刻度线长度默认为5
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: { // 刻度标签文字的颜色
            color: '#666'
          },
          // 数组倒序
          data: _barObj.citys
        }
      } else if (_barObj.lineBar) {
        yAxis = [
          {
            type:  'value',
            // name: '冷链报警次数',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee',
                type: 'dashed'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ccc'
              }
            },
            axisTick: {
              length: 0, // 刻度线长度默认为5
              lineStyle: {
                color: '#eee'
              }
            },
            axisLabel: { // 刻度标签文字的颜色
              color: '#666'
            }
          },
          {
            type:  'value',
            // name: '冷链报警率',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee',
                type: 'dashed'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ccc'
              }
            },
            axisTick: {
              length: 0, // 刻度线长度默认为5
              lineStyle: {
                color: '#eee'
              }
            },
            axisLabel: { // 刻度标签文字的颜色
              color: '#666'
            },
            interval: 10,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ]
      } else {
        yAxis = {
          type:  'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            length: 0, // 刻度线长度默认为5
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: { // 刻度标签文字的颜色
            color: '#666'
          }
        }
      }
      let _dataZoom = []
      if (_barObj.rotate || this.isDetail) {
        _dataZoom = []
      } else {
        _dataZoom = [
          {
            show: true,
            start: 0,
            end: 60,
            zoomLock: false, // 锁定缩放，只能平移
            left: '20%',
            right: '20%',
            bottom: '10%'
          },
          {
            type: 'inside',
            start: 0,
            end: 60
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 20,
            height: '60%',
            showDataShadow: false,
            left: '90%',
            start: 60,
            end: 100
          }
        ]
      }
      // 数据 series
      let series = []
      let Lth = _barObj.legend.length
      if (_barObj.lineBar) {
        series.push(
          {
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0],
              color: _barObj.color[0]
            },
            name: _barObj.legend[0],
            data:  _barObj.datas[0]
          },
          {
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: {
              color: _barObj.color[1]
            },
            name: _barObj.legend[1],
            data:  _barObj.datas[1]
          }
        )
      } else {
        for (let i = 0; i < Lth; i++) {
          series.push(
            {
              type: 'bar',
              stack: _barObj.rotate ? true : false,
              barMaxWidth: '20',
              barGap: '20%',
              itemStyle: {
                barBorderRadius: _barObj.rotate ? [0, 0, 0, 0] : [5, 5, 0, 0],
                color: _barObj.color[i]
              },
              name: _barObj.legend[i],
              data:  _barObj.datas[i]
            }
          )
        }
      }
      option['yAxis'] = yAxis
      // option['dataZoom'] = _dataZoom
      option['series'] = series
      this.option = option
      _this.barChart = _this.$echarts.init(document.getElementById(_barObj.id))
      _this.barChart.setOption(option)
      // 改变浏览器窗口的时候图形跟随容器大小改变自适应
      window.removeEventListener('resize', () => {
        _this.barChart.resize()
      })
      window.addEventListener('resize', () => {
        _this.barChart.resize()
      })
    }
  },
  mounted () {
    this._initEcharts()
  },
  watch: {
    'barObj.datas' () {
      this._initEcharts()
    }
  }
};
</script>

<style scoped>

</style>
