<template>
  <div>
    <div class="box" id="box">
      <div id="mapChart" class="chart" style="height: 800px;"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import cityMap from "@/utils/china-main-city-map.js"

//中国地图（第一级地图）的ID、Name、Json数据
var chinaJson = null;

//记录父级ID、Name
var mapStack = [];
var parentId = null;
var parentName = null;

//Echarts地图全局变量，主要是在返回上级地图的方法中会用到
var myChart = null;
export default {
  name: "chinaMap",
  props: {
    dataArr: Array,
    subMapId: String
  },
  data () {
    return {
      chinaId: '',
      chinaName: ''
    }
  },
  computed: {
    userinfo () {
      return this.$store.state.userinfo
    },
    // 用于判断是否点击到区县一级实现放大及设置中心点
    isQX () {
      return this.$store.state.isQX
    }
  },
  mounted: function () {
    // 初始化 chinaId  chinaName
    if (this.subMapId !== '') {
      this.chinaId = this.subMapId.substr(0, 6)
    } else if (this.userinfo.districtCode.substr(0, 6).substr(-2) !== '00') {
      this.chinaId = this.userinfo.districtCode.substr(0, 4) + '00'
    } else {
      this.chinaId = this.userinfo.districtCode.substr(0, 6)
    }
    this.chinaName = this.userinfo.districtName
    this.mapChart("mapChart")
  },
  methods: {
    /**
     * Echarts地图
     */
    mapChart(divid) {
      let _this = this
      if(_this.chinaId.substr(-2) !== '00') {
        _this.chinaId = _this.chinaId.substr(0, 4) + '00'
      }
      axios.get("./static/json/map/" + _this.chinaId + ".json", {}).then(response => {
        const mapJson = response.data;
        chinaJson = mapJson;
        let dom = document.getElementById(divid)
        let $width = document.getElementById("box").offsetWidth
        // dom.style.height = $width + 'px'
        myChart = _this.$echarts.init(dom)
        window.removeEventListener('resize', () => {
          myChart.resize()
        })
        window.addEventListener('resize', () => {
          myChart.resize()
        })        
        _this.registerAndsetOption(myChart, _this.chinaId, _this.chinaName, mapJson, false);
        parentId = _this.chinaId;
        parentName = "";
        // 区县一级的时候禁止点击
        if (this.userinfo.districtCode.substr(0, 6).substr(-2) !== '00' || _this.chinaId.substr(-2) !== '00') {
          return
        } else {
          myChart.on("click", function (param) {
            var cityId = cityMap[param.name]  
            if (cityId) {
              // 代表有下级地图
              axios.get("./static/json/map/" + cityId + ".json", {}).then(response => {
                const mapJson = response.data;
                _this.registerAndsetOption(myChart, cityId, param.name, mapJson, true);
              });
              
              if (_this.$store.state.isDetail) {
                // 地图下钻 detail Seven-bar
                _this.$EventBus.$emit('SevengetmapDatas', cityId)
              } else {
                // 地图下钻 home
                _this.$EventBus.$emit("getCityCode", cityId)
              }
            } else {
              if (_this.chinaId.substr(-4) !== '0000') {
                let data = _this.$props.dataArr
                for (let item of data) {
                  if (item[3] === param.name) {
                    _this.$store.state.isQX = true
                    _this.$store.state.centerQX = [item[0], item[1]]
                    
                    if (_this.$store.state.isDetail) {
                      // 地图下钻 detail Seven-bar
                      _this.$EventBus.$emit('SevengetQXMapDatas', item[4])
                    } else {
                      // 地图下钻 home
                      _this.$EventBus.$emit("getQXMapDatas", item[4])
                    }
                  }
                }
              }
            }
          });
        }
      });
    },

    /**
     *
     * @param {*} myChart
     * @param {*} id        省市县Id
     * @param {*} name      省市县名称
     * @param {*} mapJson   地图Json数据
     * @param {*} flag      是否往mapStack里添加parentId，parentName
     */
    registerAndsetOption(myChart, id, name, mapJson, flag) {
      this.$echarts.registerMap(name, mapJson);     
      let data = this.$props.dataArr;
      let mapMax = Math.max(...data.map(item => item[2]))
      let mapMin = Math.min(...data.map(item => item[2]))
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          bottom: 20,
          left: 10,
          show: true,
          color: ['#ff342f', '#ff9b2f', '#ffda2f'],                   
          // min: mapMin,
          max: mapMax,
          calculable: true,
          textStyle: {
            color: '#ccc',
            fontSize: 12
          }
        },
        geo: {
          map: name,
          label: {
            show: true
          },
          // center: [123.426644, 41.795236],
          center: this.isQX === true || this.userinfo.districtCode.substr(0, 6).substr(-2) !== '00' ? this.$store.state.centerQX : null,
          roam: true,
          aspectScale: 0.6,
          zoom: this.isQX === true || this.userinfo.districtCode.substr(0, 6).substr(-2) !== '00' ? 2 : 1.2,
          label: {
            normal: {
              show: true,
              color: '#000'
            },
            emphasis: {
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#76b1ff',
              borderColor: '#eee',
              shadowColor: '#76b1ff',
              shadowBlur: 10,
              borderWidth: 1
            },
            emphasis: {
              // 鼠标移入颜色
              areaColor: '#409EFF',
              borderWidth: 0
            }
          }
        },
        series: [{
          mapType: name,
          top: 'center',
          left: 'center',
          type: 'heatmap',
          coordinateSystem: 'geo',
          pointSize: 8,
          blurSize: 1,
          minOpacity: 0.5,
          maxOpacity: 1,
          data: data,
          // 鼠标移入
          emphasis: {
            show: false,
            itemStyle: {
              areaColor: 'rgb(255,255,0,1)'
            }
          }
        }]
      })
    }
  }
};
</script>
<style scoped>
.box {
  /* background-color: rgba(24, 27, 52, 0.62); */
}
.chart {
  position: absolute;
  width: 100%;  
  top: 8%;
}
</style>
