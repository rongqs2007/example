<template>
  <div class="MapApi">
    <baidu-map @ready="handler" class="MapApi" :center="center" :zoom="zoom" :dragging="isDragging" :scroll-wheel-zoom="isScrollZoom" :mapStyle="mapStyle">
      <bm-boundary
        v-for="(item, index) in dataArr"
        :name="item.vaccAreaOrClinic"
        :key="item.vaccAreaOrClinic"
        strokeColor="#000"
        :strokeWeight="1"
        :fillColor="colors[index + 1]"
        :fillOpacity="1"
        @click="handleClick(item)"
      >
      </bm-boundary>
      <!-- :position="{lng: item.latitude, lat: item.longitude}" -->
      <bm-label
        v-for="(item, index) in dataArr"
        :content="item.vaccAreaOrClinic"
        :position="{lng: item.latitude, lat: item.longitude}"
        :key="index"
        :title="item.vaccAreaOrClinic"
        :labelStyle="{color: '#fff',fontSize : '12px',border: 'none',background: 'none'}"
      >
      </bm-label>
      <!-- 城市 搜索 列表 -->
      <!-- <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{width:100,height:10}"></bm-city-list> -->
      <!-- 定位 -->
      <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
      <!-- <bml-heatmap :data="hotDatas" :max="100" :radius="10" :gradient="gradient" :opacity="0"></bml-heatmap> -->
    </baidu-map>
  </div>
</template>

<script>
import { BmlHeatmap, BMapLib} from 'vue-baidu-map'
import 'echarts/extension/bmap/bmap'

const citys = ['辽宁', '沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市']
// 向地图添加辽宁省地级市中心点的标注
const citysCenters = [[123.43, 41.80], [121.62, 38.92], [122.98, 41.10], [123.98, 41.88], [123.77, 41.30], [124.38, 40.13], [121.13, 41.10], [122.23, 40.67], [121.67, 42.02], [123.17, 41.27], [122.07, 41.12], [123.83, 42.28], [120.45, 41.57], [120.83, 40.72]]

export default {
  name: 'AreaMap',
  props: {
    dataArr: Array
  },
  components: {
    BmlHeatmap,
    BMapLib
  },
  data () {
    return {
      colors: ['#ABC321', '#0091ea', '#00b0ff', '#40c4ff', '#80d8ff', '#01579b', '#0277bd', '#0288d1', '#039be5', '#03a9f4', '#29b6f6', '#4fc3f7', '#81d4fa', '#b3e5fc', '#e1f5fe'],
      mapStyle: {
        styleJson: []
      },
      center: '辽宁省',
      zoom: 8,
      isDragging: true,
      isScrollZoom: false,
      // 终止递归方法的变量 resetMkPoint
      isContinue: true,
      globalseries: [],
      gradient: {0: '#ff0066', 1: '#ff0066'},
      // data: [
      //   {lng: 120.83, lat: 40.72, count: 1000},
      //   {lng: 123.43, lat: 41.80, count: 50000},
      //   {lng: 123.77, lat: 41.30, count: 6500}
      // ],
      point: null,
      // 定义全局地图实例
      myMap: null,
      myBMap: null
    }
  },
  computed: {
    userinfo () {
      return this.$store.state.userinfo
    }
  },
  methods: {
    handler ({BMap, map}) {
      let _this = this
      _this.myMap = map
      _this.myMap.centerAndZoom('辽宁', 8)
      let bdary = new BMap.Boundary()
      bdary.get('辽宁', function (rs) {    //获取行政区域
        _this.myMap.clearOverlays()                //清除地图覆盖物
        //东西经南北纬的范围
        let EN_JW = "180, 90;"        //东北角
        let NW_JW = "-180,  90;"      //西北角
        let WS_JW = "-180, -90;"      //西南角
        let SE_JW = "180, -90;"       //东南角
        //添加环形遮罩层
        let ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, { strokeColor: "none", fillColor: "rgb(246,246,246)", fillOpacity:0.8, strokeOpacity: 0.5 }) //建立多边形覆盖物
        _this.myMap.addOverlay(ply1);
        //5. 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
        let ply = new BMap.Polygon(rs.boundaries[0], { strokeWeight: 1, strokeColor: "#00f",fillColor: "" })
        _this.myMap.addOverlay(ply)
      })
      // map.enableScrollWheelZoom(true)
      // map.enableInertialDragging()
      // this.getSetMapStyle()
      // 调整视野
      // map.setViewport()
    },
    handleClick (item) {
      console.log(item)
      // this.$EventBus.$emit('getmapDatas', item)
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
    },
    // 创建信息窗口对象
    openInfo (content, num) {
      let _html = ''
      let opts = {}
      if (num === 0) {
        opts = {
          width: 410,
          height: 270,
          // 设置允许信息窗发送短息
          enableMessage: true,
          message: 'XXXXXX'
        }
        _html = `
          <div class="infoRow">
            <p class="infoTitle">湖南省疾病预防控制中心</p>
            <div class="infoImgs">
              <img onclick="handleWat()" src="../static/images/u313.png" width="24" height="28" />
              <img onclick="handleTem()" src="../static/images/u314.png" width="20" height="28" />
            </div>
            <div class="allCounts">
              <span>87</span>分
            </div>
          </div>
          <div class="infoRow">
            <p class="addressinfos">
              <img src="../static/images/icon_address.png" width="24" height="24" />
              <span>湖南省长沙市开福区芙蓉中路1段450号</span>
            </p>
          </div>
          <div class="infoRow">
            <p class="addressinfos">
              <img src="../static/images/dianhua.png" width="20" height="24" />
              <span>0731-84305907</span>
            </p>
          </div>
          <div class="infoRow">
            <div class="twoBox">
              <div class="itemOne">
                <p>冷链设备报警</p>
                <span>15</span>
              </div>
              <div class="itemOne">
                <p>超期疫苗</p>
                <span>39</span>
              </div>
            </div>
          </div>
        `
      } else if (num !== 0 && num !== undefined) {
        opts = {
          width: 460,
          height: 220,
          // 设置允许信息窗发送短息
          enableMessage: true,
          message: 'XXXXXX'
        }
        _html = `
          <div class="infoRow">
            <p class="infoTitle">${content}${num}</p>
            <div class="infoImgs" style="width: 20%;">
              <img onclick="handleWat()" src="../static/images/u313.png" width="24" height="28" />
              <img onclick="handleTem()" src="../static/images/u314.png" width="20" height="28" />
            </div>
          </div>
          <div class="infoRow">
            <div class="serRound">
              <div class="serItem">
                <img src="../static/images/infos5.png" width="50" height="50" />
                <div class="iconRight">
                  <p>服务半径</p>
                  <p>59km</p>
                </div>
              </div>
              <div class="serItem">
                <img src="../static/images/infos4.png" width="50" height="50" />
                <div class="iconRight">
                  <p>服务人口</p>
                  <p>593w</p>
                </div>
              </div>
            </div>
            <div class="twoBox">
              <div class="itemOne">
                <p>冷链设备报警</p>
                <span>15</span>
              </div>
              <div class="itemOne">
                <p>超期疫苗</p>
                <span>39</span>
              </div>
            </div>
          </div>
        `
      } else {
        opts = {
          width: 310,
          height: 290,
          // 设置允许信息窗发送短息
          enableMessage: true,
          message: 'XXXXXX'
        }
        _html = `
          <div class="infoRow">
            <p class="carInfotitle">苏A·98643</p>
            <p class="carInfotitle">19930821-15</p>
          </div>
          <div class="infoRow carinfoRow">
            <div class="serItem">
              <img src="../static/images/infos3.png" width="50" height="50" />
              <div class="iconRight">
                <p>负责人</p>
                <p>张三</p>
              </div>
            </div>
          </div>
          <div class="infoRow carinfoRow">
            <div class="serItem">
              <img src="../static/images/infos2.png" width="50" height="50" />
              <div class="iconRight">
                <p>出库单位</p>
                <p>湖南省疾病预防控制中心</p>
              </div>
            </div>
          </div>
          <div class="infoRow carinfoRow">
            <div class="serItem">
              <img src="../static/images/infos1.png" width="50" height="50" />
              <div class="iconRight">
                <p>入库单位</p>
                <p>长沙市疾病预防控制中心</p>
              </div>
            </div>
          </div>
        `
      }
      let infoWindow = new BMap.InfoWindow(_html, opts)
      return infoWindow
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
  position: relative;
}
.backBtn{
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10000;
  background: #0091ea;
  color: #fff;
  cursor: pointer;
}
</style>
