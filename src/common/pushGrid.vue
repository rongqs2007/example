<template>
  <div class="pushGrid">
    <ul ref="listsUl">
      <li
        @click="handleClick(index)"
        class="itemLi"
        :class="listIndex === index ? 'actived' : ''"
        v-for="(item,index) in lists"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PushGrid',
  data () {
    return {
      lists: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      listIndex: 4
    }
  },
  methods: {
    handleClick (index) {
      // this.listIndex = index
      let parentId = this.$refs.listsUl
      parentId.insertBefore(parentId.childNodes[this.lists.length - 1], parentId.childNodes[0])
    }
  }
}
</script>

<style scoped>
.pushGrid{
  width: 260px;
  margin: 0 auto;
  padding: 20px 0;
}
.pushGrid ul{
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
}
.itemLi{
  width: 33.33%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: #ff9221;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.actived{
  background: #6a2ad2;
}
</style>
