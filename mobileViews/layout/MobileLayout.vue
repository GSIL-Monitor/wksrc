<template>
<div class="mobile-app-wrapper" :class="classObj">
  <div v-if="device==='mobile'" class="">
  </div>
  <div class="">
    <mobile-main>
    </mobile-main>
  </div>
</div>
</template>

<script>
import { MobileMain } from './components'
// 手机前台自动px转rem
// import '@/utils/rem'

export default {
  name: 'mobile-layout',
  components: {
    MobileMain
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {}
    }
  },
  created() {
    // 基准大小
    const baseSize = 32
    // 设置 rem 函数
    function setRem() {
      // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
      const scale = document.documentElement.clientWidth / 750
      // 设置页面根节点字体大小
      document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
    }
    // 初始化
    setRem()
    // 改变窗口大小时重新设置 rem
    window.onresize = function() {
      setRem()
    }
  },
  // header的dialog弹框参考navbar, 开关放在state
  methods: {
    // refreshView() {
    //   this.$router.push({ path: this.$router.path, query: { t: Date.now() }})
    // },
    // toggleDialog() {
    //   this.$store.dispatch('toggleHDialog')
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
@import 'src/styles/media.scss';

.el-select-dropdown__item {
    height: 64px;
    font-size: 32px!important;
}

.mobile-app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    /* overflow: hidden; */
}
/* .drawer-bg { */
  /*   background: #000; */
  /*   opacity: 0.3; */
  /*   width: 100%; */
  /*   top: 0; */
  /*   height: 100%; */
  /*   position: absolute; */
  /*   z-index: 999; */
  /* } */
</style>
