<template>
  <div class="marquee">
    <div>最新公告：</div>
    <div class="marqueeList">
      <ul :class="animate ? 'marqueeTop' : ''">
        <li v-for="item in marqueeList" :key="item.name">
          {{ item.name }} {{ item.city }} {{ item.amount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'marquee',
    props: ['marqueeList'],
    data () {
      return {
        animate: false
      }
    },
    methods: {
      showMarquee () {
        this.animate = true
        setTimeout(() => {
          this.marqueeList.push(this.marqueeList[0])
          this.marqueeList.shift()
          this.animate = false
        }, 500)
      }
    },
    created: function () {
      setInterval(this.showMarquee, 3000)
    }
  }
</script>

<style scoped>
  .marquee{
    display: flex;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
  .marqueeList li{
    color: yellow;
  }
  .marqueeTop{
    margin-top: -40px;
    transition: all .5s;
  }
</style>