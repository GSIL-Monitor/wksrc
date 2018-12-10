<template>
<div class="app-wrapper" :class="classObj">
  <div v-if="device==='mobile'" class="">
  </div>
  <div class="">
    <mobile-main>
    </mobile-main>
  </div>
</div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { MobileMain } from './components'

export default {
  name: 'default-layout',
  components: {
    MobileMain, Sticky
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {}
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
  @import 'src/styles/media.scss';
 </style>
