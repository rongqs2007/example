// 改变浏览器窗口的时候图形跟随容器大小改变自适应
export function changeResize (objID) {
  // 针对页面中多个echarts图标跟随浏览器大小改变而缩放时候使用
  // 如果echarts图标被销毁后再重建的话 浏览器会报错的 解决的办法是先取消监听再监听,此处的公共方法传参也会报错 需在mixins.js中作为公共方法使用
  window.addEventListener('resize', () => {
    objID.resize()
  })
  // 针对页面中单个echarts图标跟随浏览器大小改变而缩放时候使用，多个时候不起作用
  // window.onresize = function () {
  //   objID.resize()
  // }
}

// 改变div容器大小的时候图形跟随容器大小改变自适应
export function changeObjResize (objID) {
  objID.resize()
}

// 元件标题
export function getTitle (Title, isShow, Color, fontSize, Left) {
  let title = {
    text: Title,
    show: isShow,
    textStyle: {
      fontSize: fontSize,
      color: Color
    },
    left: Left
  }
  return title
}

// 元件样式控制normal
export function getTitleStyle1 (Opacity, Border, Color) {
  let normal = {
    opacity: Opacity,
    borderWidth: Border,
    borderColor: Color
  }
  return normal
}

// 元件样式控制normal
export function getTitleStyle2 (Fcolor, Opacity, Border, Color) {
  let normal = {
    color: Fcolor,
    opacity: Opacity,
    borderWidth: Border,
    borderColor: Color
  }
  return normal
}

// 元件图例
export function getLegend (isShow, Type, direction, Left, Top, SelectedMode, Data) {
  let lenged = {
    show: isShow,
    type: Type, // 'plain'：普通图例。缺省就是普通图例。'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
    orient: direction, // 'horizontal'——水平  vertical——垂直
    left: Left,
    top: Top,
    selectedMode: SelectedMode,
    data: Data
  }
  return lenged
}

// 元件grid 组件离容器上下左右侧的距离，这里所有echarts图标均设置为默认值
export function getGrid () {
  let grid = {
    left: '2%',
    top: '20%',
    bottom: '20%',
    right: '5%',
    containLabel: true
  }
  return grid
}

// label
export function getLabel (isShow, Pos) {
  let normal = {
    show: isShow,
    position: Pos
  }
  return normal
}

// 获取浏览器的滚动条宽度
export function _scrollbarWidth () {
  // 创建一个div
  let objDiv = document.createElement('div')
  let scrollbarWidth = null
  let styles = {
    width: '100%',
    height: '100%',
    overflowY: 'scroll'
  }
  for (let i in styles) {
    objDiv.style[i] = styles[i]
  }
  document.body.appendChild(objDiv)
  // offsetWidth：获取到的值是width+padding+border
  // clientWidth： 获取对象可见内容的宽度，不包括滚动条，不包括边框
  scrollbarWidth = objDiv.offsetWidth - objDiv.clientWidth
  // 移除创建的div
  objDiv.remove()
  return scrollbarWidth
}

// 数组排序
// 数组从大到小的排序
export function maxSort (Arr) {
  let max
  for (let i = 0; i < Arr.length; i++) {
    for (let j = i; j < Arr.length; j++) {
      if (Arr[i] < Arr[j]) {
        max = Arr[j]
        Arr[j] = Arr[i]
        Arr[i] = max
      }
    }
  }
  return Arr
}

// 数组从大到小的排序
export function minSort (Arr) {
  let min
  for (let i = 0; i < Arr.length; i++) {
    for (let j = i; j < Arr.length; j++) {
      if (Arr[i] > Arr[j]) {
        min = Arr[j]
        Arr[j] = Arr[i]
        Arr[i] = min
      }
    }
  }
  return Arr
}

// 创建一个元素并将其插入元素集合内的第n个位置
export function createEleLi (n, Tag, parentId, Content, Styles, Flag, This) {
  let _li = document.createElement(Tag)
  _li.innerHTML = Content
  for (let i in Styles) {
    _li.style[i] = Styles[i]
  }
  parentId.insertBefore(_li, parentId.childNodes[n])
  if (Flag) {
    _li.onclick = () => {
      This.$EventBus.$emit('onClick', _li)
    }
  }
}

// 计算设定时间日期与当前日期的天数差值
export function computedDays (Day) {
  let _inputTime = new Date(Day).getTime()
  let _currTime = new Date().getTime()
  let diffVal = Math.floor((_currTime - _inputTime) / (1000 * 60 * 60 * 24))
  if (diffVal >= 10) {
    console.log('返回的时间是否大于等于10天 ----- ' + diffVal)
  }
}

// 计算输入文字字数限制
export function computedWords (newval, type, This) {
  // newval !== null 的时候是避免v-if中html没有渲染元素产生的报错信息
  if (newval !== '' && newval !== null) {
    let _changeString = newval.toString()
    This.words = 20 - _changeString.length
    if (_changeString.length > 20) {
      This.$Message[type]({
        background: true,
        content: '已超过20个汉字！'
      })
      // 及时更新返回输入框的值保持不变 当超出20个范围的时候
      This.$nextTick(() => {
        This.value = _changeString.substring(0, 20)
      })
    }
  } else {
    This.words = 20
  }
}

// 数据类型的判断
// 如果对象是 Array 或 Date ，就无法通过 typeof 来判断他们的类型，因为都是 返回 object。
// constructor属性返回所有JS变量的构造函数
export function judgeDataType (Data, This) {
  let _type = ['String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'Function']
  if (Data !== NaN && Data !== null && Data !== undefined) {
    for (let i = 0; i < _type.length; i++) {
      if (Data.constructor.toString().indexOf(_type[i]) > -1) {
        return _type[i]
      }
    }
  }
}

// 数组去重, 并返回去重后的新数组，此方法不会改变原数组
export function arrayRemoval (Arr, This) {
  let newArr = Arr.filter(function (item, index, Arr) {
    // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return Arr.indexOf(item, 0) === index
  })
  return newArr
}
