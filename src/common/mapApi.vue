<template>
  <div class="MapApi">
    <baidu-map
      :style="{width:map.width,height:map.height}"
      class="map"
      ak="4GKOZZCm6mjrjBFzrjFPoqwSMtwQcvIs"
      :zoom="map.zoom"
      :center="{lng: map.center.lng, lat: map.center.lat}"
      @ready="handler"
      :scroll-wheel-zoom="true"
    >
      <!--比例尺控件-->
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <!--缩放控件-->
      <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>
      <!--聚合动态添加的点坐标-->
      <!-- <bm-marker-clusterer :averageCenter="true">
        <bm-marker v-for="marker of markers" :key="marker.code" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)"></bm-marker>
      </bm-marker-clusterer> -->
      <!--信息窗体-->
      <bm-info-window :position="{lng: infoWindow.info.lng, lat: infoWindow.info.lat}" :title="infoWindow.info.name" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
          <p><span class="left">单位面积能耗：</span><span class="right">{{infoWindow.info.areaEnergy}}kWh/㎡</span></p>
          <p><span class="left">建筑面积：</span><span class="right">{{infoWindow.info.area}}㎡</span></p>
          <p><span class="left">电耗：</span><span class="right">{{infoWindow.info.energy}}kWh</span></p>
          <p><span class="left">水耗：</span><span class="right">{{infoWindow.info.water}}m³</span></p>
          <p><span class="left">气耗：</span><span class="right">{{infoWindow.info.air}}m³</span></p>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
// 百度地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmScale from 'vue-baidu-map/components/controls/Scale'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
import BmMarkerClusterer from 'vue-baidu-map/components/extra/MarkerClusterer'
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'

export default {
  name: 'MapApi',
  components: {
    BaiduMap,
    BmScale,
    BmNavigation,
    BmMarkerClusterer,
    BmMarker,
    BmInfoWindow
  },
  data () {
    return {
      map: {
        // 南京市
        center: {lng: 118.802422, lat: 32.065631},
        zoom: 12,
        width: '100%',
        height: '710px'
      },
      markers: [],
      infoWindow: {
        lng: 0,
        lat: 0,
        show: false,
        info: {
          air: 0,
          area: 12313,
          areaEnergy: 0.64,
          code: '440300A055',
          energy: 7922.66,
          lat: '32.043433',
          lng: '118.784107',
          name: '市人民检察院',
          water: 0
        }
      }
    }
  },
  methods: {
    // 查看详情
    lookDetail (data, target) {
      this.infoWindow.show = true
      this.infoWindow.info = data
      this.activeName = data.name
      // 为弹窗口标题添加title
      this.$nextTick(() => {
        var win = document.querySelector('.BMap_bubble_title')
        win.title = this.activeName
      })
      // 点击的是左侧列表项，则不需要滚动
      if (target === 'left') {
        this.map.center = {lng: data.lng, lat: data.lat}
        this.map.zoom = 15
        return
      }
      // 滚动到指定元素位置
      this.$nextTick(() => {
        var obj = document.querySelector('.active')
        var scrollTop = obj.offsetTop
        this.$refs.box.scrollTop = scrollTop - 180
      })
    },
    // 地图初始化
    handler ({BMap, map}) {
      console.log(BMap, map)
    },
    infoWindowClose (e) {
      this.infoWindow.show = false
    },
    infoWindowOpen (e) {
      this.infoWindow.show = true
    },
    // 项目分布地图
    getProPositionMap () {
      // PmDistributionService.instance().getProPositionMap(this.searchParams).then((res) => {
      //   if (res.code === 200) {
      //     // console.log('res',res)
      //     this.markers = res.data.list
      //   } else {
      //     this.$message({
      //       message: '获取数据失败',
      //       type: 'error'
      //     })
      //   }
      // })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
