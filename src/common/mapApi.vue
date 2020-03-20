<template>
  <div class="MapApi">
    <!-- <div id="container" :style="{width: '100%', height: height + 'px'}"></div> -->
    <baidu-map @ready="handler" id="container" :style="{width: '100%', height: height + 'px'}"></baidu-map>
    <Modal v-model="modalTem">
      <p>modalTem</p>
    </Modal>
  </div>
</template>

<script>
import 'echarts/extension/bmap/bmap'

// 填充颜色集合
const Colors = ['#ABC321', '#0091ea', '#00b0ff', '#40c4ff', '#80d8ff', '#01579b', '#0277bd', '#0288d1', '#039be5', '#03a9f4', '#29b6f6', '#4fc3f7', '#81d4fa', '#b3e5fc', '#e1f5fe']
const citys = ['湖南', '长沙市', '岳阳市', '常德市', '衡阳市', '株洲市', '郴州市', '湘潭市', '永州市', '邵阳市', '益阳市', '怀化市', '娄底市', '湘西州', '张家界市']
// 向地图添加湖南省地级市中心点的标注
const citysCenters = [[112.94995686314348, 28.24290780342998], [113.13852915573575, 29.365103577584573], [111.70583966445537, 29.036196868141612], [112.58201092637805, 26.898530441340593], [113.14082881784053, 27.836848709812685], [113.02814537470611, 25.777486437647323], [112.95455618735303, 27.834804306751842], [111.62075216657837, 26.425344381825504], [111.47702328502938, 27.24748704536627], [112.36584268852835, 28.56013815308687], [110.01098869322962, 27.576898694369234], [112.00249607597249, 27.70797536767105], [109.78102248275124, 28.756905173652765], [110.48931841102468, 29.123067141692292]]

export default {
  name: 'MapApi',
  props: {
    height: Number
  },
  components: {
  },
  data () {
    return {
      modalTem: false,
      // 终止递归方法的变量 resetMkPoint
      isContinue: true,
      globalseries: [],
      timer: null,
      myChart: null,
      center: {lng: 0, lat: 0},
      zoom: 8,
      point: null,
      // 定义全局地图实例
      myMap: null,
      // 定义一个空数组接受地图绘制曲线使用
      doubleCitys: [],
      // 路线终点
      epoi: [],
      // 定义一个空数组接受地图标注用于点聚合使用
      markerPoints: [],
      // 运输线上点的集合
      linesPoints: [],
      // 驾车运行路线方法
      drivingLine: [],
      drivingLines: null,
      markers: []
    }
  },
  methods: {
    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.planeFlyMap()
    },
    // 个性化的地图样式
    getSetMapStyle () {
      this.$axios('static/custom_map_config.json')
        .then(res => {
          let _datas = res.data
          if (res.status === 200 && _datas.length > 0) {
            // 个性化的样式旧版本2.0
            this.myMap.setMapStyle({styleJson: _datas})
            // 个性化的样式新版本3.0
            // this.myMap.setMapStyleV2({styleJson: _datas})
          }
        })
    },
    planeFlyMap () {
      let _this = this
      if (_this.myChart !== null) {
        _this.myChart.dispose()
      }
      let _bmap = {
        center: [112.94995686314348, 28.24290780342998],
        zoom: 10,
        roam: true
      }
      _this.point = new BMap.Point(_bmap.center[0], _bmap.center[1])
      // 湖南各市中心点数据
      let geoCoordMap = {}
      for (let i = 0; i < citys.length; i++) {
        if (i < 14) {
          geoCoordMap[`'${citys[i + 1]}'`] = citysCenters[i]
        }
      }
      // console.log('湖南各市中心点数据:', geoCoordMap)
      // 长沙市对应到其他各市的数据
      let CSData = []
      for (let i = 0; i < citys.length; i++) {
        if (i < 13) {
          CSData.push(
            [
              {
                name: citys[1]
              },
              {
                name: citys[i + 2],
                value: Math.floor(Math.random() * 100)
              }
            ]
          )
        }
      }
      // console.log('长沙市对应到其他各市的数据', CSData)
      let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
      let convertData = function (data) {
        let res = []
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i]
          let fromCoord = geoCoordMap[`'${dataItem[0].name}'`]
          let toCoord = geoCoordMap[`'${dataItem[1].name}'`]
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
              value: dataItem[1].value
            })
          }
        }
        return res
      };
      // 此处分号不能删除会报错

      [['长沙市', CSData]].forEach(function (item) {
        _this.globalseries.push({
          name: item[0],
          coordinateSystem: 'bmap',
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: 'orange',
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        {
          name: item[0],
          coordinateSystem: 'bmap',
          type: 'lines',
          zlevel: 2,
          symbol: ['none', 'arrow'],
          symbolSize: 10,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            // 飞机大小控制
            symbolSize: 25
          },
          lineStyle: {
            normal: {
              color: 'orange',
              width: 2,
              opacity: 1,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        },
        {
          name: item[0],
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: false,
              position: 'right',
              formatter: '{b}',
              color: '#000',
              fontWeight: 'bold'
            }
          },
          symbolSize: 1,
          // symbolSize: function (a, p) {
          //   let size = [10 * (p.name.length), 30]
          //   return size
          // },
          itemStyle: {
            normal: {
              color: 'orange'
            }
          },
          data: item[1].map(function (dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[`'${dataItem[1].name}'`].concat([dataItem[1].value])
            }
          })
        })
      })
      let option = {
        bmap: _bmap,
        visualMap: {
          type: 'continuous',
          orient: 'vertical',
          left: 20,
          bottom: 10,
          // min: 0,
          // max: 100,
          itemWidth: 25,
          itemHeight: 180,
          hoverLink: false,
          // 表示 目标系列 的视觉样式。
          target: {
            inRange: {
              color: 'orange'
            }
          },
          // 表示 visualMap-continuous 本身的视觉样式。
          controller: {
            inRange: {
              color: ['#0277bd', '#0288d1', '#039be5', '#03a9f4', '#29b6f6', '#4fc3f7', '#b3e5fc', '#e1f5fe']
            }
          }
        },
        series: []
      }
      _this.myChart = _this.$echarts.init(document.getElementById('container'))
      _this.myChart.setOption(option)
      // 改变浏览器窗口的时候图形跟随容器大小改变自适应
      window.removeEventListener('resize', () => {
        _this.myChart.resize()
      })
      window.addEventListener('resize', () => {
        _this.myChart.resize()
      })
      // 递归方法实现地图展示色块覆盖物添加到地图上，以确保每一次色块颜色填充完成后再次递归调用
      this.getBoundary(citys[0], 0)
      // 个性化的地图样式
      this.getSetMapStyle()
      // 获取map实例赋予全局变量map
      this.myMap = _this.myChart.getModel().getComponent('bmap').getBMap()
      this.myMap.setMinZoom(7)
      this.myMap.setMaxZoom(8)
      // 向地图添加控件
      this.addMapControl()
    },
    // 获取地区边界
    getBoundary (cityName, index) {
      let bdary = new BMap.Boundary()
      let pointArray = []
      let ply
      let count
      // 获取行政区域
      bdary.get(cityName, (res) => {
        count = res.boundaries.length // 行政区域的点有多少个
        if (count === 0) {
          alert('未能获取当前输入行政区域')
          return
        }
        for (let i = 0; i < count; i++) {
          ply = new BMap.Polygon(res.boundaries[i], {
            strokeWeight: 1,
            strokeColor: '#000',
            fillOpacity: 1,
            fillColor: Colors[index]
          })
          // 建立多边形覆盖物
          this.myMap.addOverlay(ply) // 添加覆盖物
          pointArray = pointArray.concat(ply.getPath())
        }
        if (index++ < citys.length - 1) {
          this.getBoundary(citys[index], index)
          if (cityName === '湖南') {
            this.myMap.setViewport(pointArray)
          }
        } else {
          // 将飞机运行滞后在地图色块渲染完成再执行
          this.myChart.setOption({
            series: this.globalseries
          })
          // 创建和初始化地图 在递归调用中的if条件最后一次不执行后执行else里面的方法 就相当于执行了一次 也就是最后再执行此处的代码
          // 向地图中添加marker
          this.addMarker()
          // 初始化汽车路线
          this.drivingSearch(this.point, this.epoi[0], 0)
          setTimeout(() => {
            this.run()
          }, 2500)
        }
      })
    },
    // 添加地图控件
    addMapControl () {
      // 修改控件配置
      let opts = {anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}
      // 平移缩放控件  PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
      this.myMap.addControl(new BMap.NavigationControl(opts))
      // 比例尺  默认位于地图左下方，显示地图的比例关系
      // this.myMap.addControl(new BMap.ScaleControl())
      // 地图类型  默认位于地图右上方
      this.myMap.addControl(new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
      }))
      // 缩略地图  默认位于地图右下方，是一个可折叠的缩略地图
      // this.myMap.addControl(new BMap.OverviewMapControl())
      // 定位  针对移动端开发，默认位于地图左下方
      // this.map.addControl(new BMap.GeolocationControl())
    },
    // 创建标注点
    addMarker () {
      this.doubleCitys = []
      for (let i = 0; i < citysCenters.length; i++) {
        let points = new BMap.Point(citysCenters[i][0], citysCenters[i][1])
        if (i !== 0) {
          this.doubleCitys.push([this.point, points])
        }
        this.createIcon(points, citys[i + 1], i)
      }
      if (this.doubleCitys !== []) {
        this.epoi = []
        for (let j = 0; j < this.doubleCitys.length; j++) {
          this.epoi.push(this.doubleCitys[j][1])
        }
      }
    },
    // 定义标注图标 通过Icon类可实现自定义标注的图标，下面示例通过参数MarkerOptions的icon属性进行设置，也可以使用marker.setIcon()方法。
    // 创建标注对象并添加到地图 生成icon
    createIcon (points, cityName, num) {
      let myIcon = null
      if (num === 0) {
        myIcon = new BMap.Icon(require('../assets/images/logoicon.png'), new BMap.Size(24, 24))
      } else if (num > 8) {
        myIcon = new BMap.Icon(require('../assets/images/grayicon.png'), new BMap.Size(24, 24))
      } else {
        myIcon = new BMap.Icon(require('../assets/images/greenicon.png'), new BMap.Size(24, 24))
      }
      let marker = new BMap.Marker(new BMap.Point(points.lng, points.lat), {icon: myIcon})
      // 随机添加几个标注点
      let markerRandomA = null
      let markerRandomB = null
      if (num !== 0) {
        markerRandomA = new BMap.Marker(new BMap.Point(points.lng + Math.random() * 0.2, points.lat - Math.random() * 0.5), {icon: myIcon})
        markerRandomB = new BMap.Marker(new BMap.Point(points.lng + Math.random() * 0.3, points.lat + Math.random() * 0.1), {icon: myIcon})
      }
      this.markerPoints.push(marker)
      this.myMap.addOverlay(marker)
      this.myMap.addOverlay(markerRandomA)
      this.myMap.addOverlay(markerRandomB)

      let _infoWindow = this.openInfo(cityName, num)
      // 监听信息窗口开启
      _infoWindow.addEventListener('open', (e) => {
        window.handleTem = () => {
          console.log('handleTem')
          this.modalTem = true
        }
        window.handleWat = () => {
          console.log('handleWat')
          this.modalTem = true
        }
      })
      // 监听信息窗口关闭
      _infoWindow.addEventListener('close', (e) => {
        marker.setAnimation()
        // console.log(e)
      })
      // 事件监听 mouseover
      marker.addEventListener('mouseover', (e) => {
        // e.domEvent.stopPropagation()
        let p = e.target
        let _point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
        // 开启信息窗口
        this.myMap.openInfoWindow(_infoWindow, _point)
        // 获取所有标注点
        let allOverlay = this.myMap.getOverlays()
        for (let i = 0; i < allOverlay.length; i++) {
          // console.log(allOverlay[i])
          if (typeof allOverlay[i].setAnimation === 'function') {
            // 清除跳动动画
            allOverlay[i].setAnimation()
            if (allOverlay[i].point.lat === points.lat && allOverlay[i].point.lng === points.lng) {
              // 为当前点添加跳动动画
              allOverlay[i].setAnimation(BMAP_ANIMATION_BOUNCE)
            }
          }
        }
        // console.log('被点击了')
      })
      // 可拖拽标注
      // marker.enableDragging()
      marker.addEventListener('dragend', (e) => {
        console.log('当前位置: ' + e.point.lng + e.point.lat)
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
    },
    drivingSearch (Start, End, I) {
      this.drivingLine.push(new BMap.DrivingRoute(this.myMap, {onSearchComplete: this.drawLine}))
      this.drivingLines = this.drivingLine[I]
      // 使用递归方法实现线路的完全加载完
      if (I++ < this.epoi.length && this.isContinue) {
        this.drivingSearch(this.point, this.epoi[I], I)
        // 稍加延时确保所有对应的起终点数据获取 能进行search方法
        this.drivingLines.search(Start, End)
      }
    },
    drawLine (results) {
      let pts = {}
      let roads = {}
      if (this.drivingLines.getStatus() === BMAP_STATUS_SUCCESS) {
        pts = this.drivingLines.getResults().getPlan(0).getRoute(0).getPath()
        roads = new BMap.Polyline(pts, {strokeColor: '#44b479', strokeOpacity: 1, strokeWeight: 4, enableMassClear: true})
        this.myMap.addOverlay(roads)
        this.linesPoints[this.linesPoints.length] = pts
      }
    },
    run () {
      let _pts = []
      let _len
      let _carMk
      let _infoWindow
      let p
      let _point
      // 汽车图
      let _myIcon = new BMap.Icon(require('../assets/images/caricon.png'), new BMap.Size(20, 14))
      console.log('运输车数量(13):', this.linesPoints.length)
      for (let m = 0; m < this.linesPoints.length; m++) {
        _pts = this.linesPoints[m]
        _len = _pts.length
        _carMk = new BMap.Marker(_pts[0], {icon: _myIcon})
        _carMk.setTop(true)
        this.myMap.addOverlay(_carMk)
        this.resetMkPoint(1, _len, _pts, _carMk)
        // 汽车鼠标事件
        _infoWindow = this.openInfo()
        // 事件监听 mouseover
        _carMk.addEventListener('mouseover', (e) => {
          p = e.target
          _point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
          // 开启信息窗口
          this.myMap.openInfoWindow(_infoWindow, _point)
        })
      }
    },
    resetMkPoint (k, len, pts, carMk) {
      if (k < len && this.isContinue) {
        carMk.setPosition(pts[k])
        this.timer = setTimeout(() => {
          // 汽车行走的快慢调节
          k++
          this.resetMkPoint(k, len, pts, carMk)
        }, 0)
      }
      // 此处注释为到达终点后汽车图标消失
      // else {
      //   myMap.removeOverlay(carMk)
      // }
    }
  },
  mounted () {
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.timer = null
  }
}
</script>

<style scoped>
.MapApi{width: 100%;}
</style>
