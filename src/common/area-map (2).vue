<template>
  <div class="MapApi">
    <baidu-map :center="center" :zoom="zoom" @ready="handler" class="MapApi" :dragging="isDragging" :scroll-wheel-zoom="isScrollZoom" :mapStyle="mapStyle" ak='4GKOZZCm6mjrjBFzrjFPoqwSMtwQcvIs'>
      <bm-boundary
        v-if="!isLastArea && mapdatas.length > 0"
        v-for="(item, index) in mapdatas"
        :name="item.vaccAreaOrClinic"
        :key="index"
        strokeColor="#000"
        :strokeWeight="1"
        :fillColor="colors[index + 1]"
        :fillOpacity="1"
        @click="handleClick(item)"
      >
      </bm-boundary>
      <bm-boundary
        v-else
        :name="areaPos.vaccAreaOrClinic"
        strokeColor="#000"
        :strokeWeight="1"
        :fillColor="colors[1]"
        :fillOpacity="1"
      >
      </bm-boundary>
      <!-- 区县级的底图渲染暂时写死 -->
      <bm-boundary
        v-if="userinfo.districtCode.substr(4, 2) !== '00'"
        :name="'辽宁省沈阳市和平区'"
        strokeColor="#000"
        :strokeWeight="1"
        :fillColor="colors[1]"
        :fillOpacity="1"
      >
      </bm-boundary>

      <!-- :position="{lng: item.latitude, lat: item.longitude}" -->
      <!-- <bm-label
        v-for="(item, index) in mapdatas"
        :content="item.vaccAreaOrClinic"
        :position="{lng: item.latitude, lat: item.longitude}"
        :key="index"
        :labelStyle="{color: '#fff',fontSize : '12px',border: 'none',background: 'none'}"
      >
      </bm-label> -->
      <!-- <bm-marker
        v-for="(marker, index) in mapdatas"
        :key="index"
        :position="{lng: marker.latitude, lat: marker.longitude}"
        @mouseover="handleMarker(marker)"
      >
      </bm-marker>
      <bm-info-window
        :position="{lng: infoLng, lat: infoLat}"
        :show="infoWindow.show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
      >
        <div style="padding-top: 20px;font-size: 14px;color: red;">{{ infoWindow.contents }}</div>
      </bm-info-window> -->
      <!-- <bml-heatmap :data="maphotdatas" :max="20" :radius="10" :gradient="gradient" :opacity="0"></bml-heatmap> -->
    </baidu-map>
  </div>
</template>

<script>
// 为了页面流畅，建议还是局部引用
import { BaiduMap,BmBoundary } from 'vue-baidu-map'
import * as homeBars from "@/api/BarsApi.js"

export default {
  name: 'AreaMap',
  props: {
    dataArr: Array,
    hotDatas: Array,
    areaPos: Object,
    isSearch: Number
  },
  components: {
    BaiduMap,
    BmBoundary
  },
  data () {
    return {
      infoWindow: {
        show: true,
        contents: ''
      },
      infoLng: 0,
      infoLat: 0,
      // vue 数据传递过来渲染的for循环组件边界与handler方法中初始化渲染的背景及调整视野机制不同步，需延时赋值for循环行政区域
      mapdatas: [],
      colors: [
          '#fab16c', '#61eda5', '#65aaf7', '#75fae1', '#fba6b7', '#8dd3fd', '#8ed12a', '#e2b824', '#ff9267', '#40e3d8',
          '#b58fd6', '#2dc4e3', '#fac285', '#ff6d64', '#d3d168', '#5bd49b', '#00bfd6', '#868bbe', '#e384cb', '#eba7c5'
        ],
      myMap: null,
      mapStyle: {
        styleJson: []
      },
      isDragging: true,
      isScrollZoom: false,
      gradient: {0: '#ff0066', 1: '#ff0066'}
    }
  },
  computed: {
    userinfo () {
      return this.$store.state.userinfo
    },
    isLastArea () {
      if (this.areaPos.areacode && this.areaPos.areacode.substr(4, 2) !== '00') {
        return true
      } else {
        return false
      }
    },
    center () {
      let _center = null
      if (this.areaPos.areacode && this.areaPos.areacode.substr(4, 2) !== '00') {
        _center = this.areaPos.vaccAreaOrClinic
      } else if (this.areaPos.areacode && this.areaPos.areacode.substr(2, 2) !== '00') {
        _center = this.areaPos.vaccAreaOrClinic
      } else if (this.userinfo.districtCode.substr(2, 2) !== '00' || this.userinfo.districtCode.substr(4, 2) !== '00') {
        // 市县区级 名称居中
        _center = this.userinfo.districtName
      } else {
        // 省级 居中 _center = '鞍山市' 以下中心点是根据鞍山市的微调 latitude: "123.001373"  longitude: "41.115054"
        _center = {lng: 122.351373, lat: 41.115054}
      }
      return _center
    },
    zoom () {
      let _zoom = 8
      if ((this.areaPos.areacode && this.areaPos.areacode.substr(4, 2) !== '00') || this.userinfo.districtCode.substr(4, 2) !== '00' || this.isSearch === 3) {
        _zoom = 10
      } else if ((this.areaPos.areacode && this.areaPos.areacode.substr(2, 2) !== '00') || this.userinfo.districtCode.substr(2, 2) !== '00' || this.isSearch === 2) {
        _zoom = 9
      } else {
        _zoom = 8
      }
      return _zoom
    }
  },
  methods: {
    handler ({BMap, map}) {
      // 获取map实例赋予全局变量map
      this.myMap = map
      if (this.dataArr.length > 0) {
        this.reSetMap()
      }
      // this.getSetMapStyle()
    },
    reSetMap () {
      let _this = this
      let bdary = new BMap.Boundary()
      let pointArray = []
      // 添加环形遮罩层 / 获取行政区域
      bdary.get(_this.center, function (rs) {
        // 清除地图覆盖物
        _this.myMap.clearOverlays()
        // 东西经南北纬的范围
        let EN_JW = "180, 90;"        // 东北角
        let NW_JW = "-180,  90;"      // 西北角
        let WS_JW = "-180, -90;"      // 西南角
        let SE_JW = "180, -90;"       // 东南角
        let ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, { strokeColor: "none", fillColor: "#000", fillOpacity: 0.5, strokeOpacity: 1 })
        // 建立多边形覆盖物
        _this.myMap.addOverlay(ply1)
        // 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
        let ply = new BMap.Polygon(rs.boundaries[0], { strokeWeight: 1, strokeColor: "#00f",fillColor: "" })
        _this.myMap.addOverlay(ply)
        pointArray = pointArray.concat(ply.getPath())
        _this.myMap.setViewport(pointArray)
        _this.myMap.setZoom(_this.zoom)
        setTimeout(() => {
          _this.mapdatas = []
          _this.mapdatas = _this.dataArr
          setTimeout(() => {
            _this.hotMap()
          }, 1500)
        }, 100)
      })
      // 禁用地图底图的点击放大
      _this.myMap.disableDoubleClickZoom()
    },
    handleClick (item) {
      if (this.$store.state.isDetail) {
        // 地图下钻 detail Seven-bar
        this.$EventBus.$emit('SevengetmapDatas', item)
      } else {
        // 地图下钻 home
        this.$EventBus.$emit('getmapDatas', item)
      }
    },
    handleMarker (marker) {
      this.infoLng = marker.latitude
      this.infoLat = marker.longitude
      this.infoWindow.contents = marker.vaccAreaOrClinic + '接种量总数： ' + marker.vaccCount
      this.infoWindow.show = true
    },
    infoWindowClose (e) {
      this.infoWindow.show = false
    },
    infoWindowOpen (e) {
      this.infoWindow.show = true
    },
    clear () {
      this.infoWindow.contents = ''
    },
    hotMap () {
      for (let i = 0; i < this.hotDatas.length; i++) {
        let _countlen = 0
        let _countNumber = 3000
        let circles = this.hotDatas[i]
        let circles_count = Object.assign(circles.count)
        // 创建圆 通过数值的位数相应的去0
        while(circles_count >= 1) {
          circles_count = circles_count / 10
          _countlen++
        }
        if (_countlen === 1) { // 个位
          _countNumber = circles.count * 100
        } else if (_countlen === 2) { // 十位
          _countNumber = circles.count * 10
        } else if (_countlen === 3) { // 百位
          _countNumber = circles.count
        } else if (_countlen === 4) { // 千位
          _countNumber = circles.count
        } else if (_countlen === 5) { // 万位
          _countNumber = circles.count / 10
        } else if (_countlen === 6) { // 十万位
          _countNumber = circles.count / 100
        } else if (_countlen === 7) { // 百万位
          _countNumber = circles.count / 1000
        } else if (_countlen === 8) { // 千万位
          _countNumber = circles.count / 10000
        } else if (_countlen === 9) { // 亿位
          _countNumber = circles.count / 100000
        }
        // 限定一个最大值 最小值
        if (_countNumber >= 7000) {
          _countNumber = 7000
        }
        if (_countlen > 0) {
          circles = new BMap.Circle(new BMap.Point(circles.lng, circles.lat), _countNumber, {
            strokeColor: "#fff223",
            strokeWeight: 5,
            strokeOpacity: 0,
            fillColor: 'red',
            fillOpacity: 1,
          })
        }
        this.myMap.addOverlay(circles)
      }
    },
    // 个性化的地图样式
    getSetMapStyle () {
      this.$axios('static/custom_map_config.json')
        .then(res => {
          let _datas = res.data
          if (res.status === 200 && _datas.length > 0) {
            this.mapStyle.styleJson = _datas
            // 个性化的样式旧版本2.0
            // this.myMap.setMapStyle({styleJson: _datas})
            // 个性化的样式新版本3.0
            // this.myMap.setMapStyleV2({styleJson: _datas})
          }
        })
    }
  },
  mounted () {
  },
  created () {
  }
};
</script>

<style scoped>
.MapApi{
  width: 100%;
  height: 970px;
}
</style>
