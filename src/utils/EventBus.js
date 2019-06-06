/**
 * EventBus 事件监听传递js文件 基于事件的同一个载体对象
 * @version $Id$
 * 组件间数据传递的通用方法
 */

import Vue from 'vue'

let EventBus = new Vue()
// $on(事件名,function(){})  $emit(事件名,数据) $off(事件名)--没有事件名的时候是取消所有监听
export default EventBus
