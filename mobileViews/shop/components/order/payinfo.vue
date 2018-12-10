<template>
  <div class="payinfo-wrapper" >
    <div class="payed-info">
      <div  v-for="(item, index) in payInfo" :key="index" class="info">
        <span class="name">{{item.name}}</span>
        <span class="value">{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'payinfo',
    props: {
      payInfo: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .payed-info
    background #f5f5f5
    margin 40px 0
    border-top 1px solid border-grey
    .info
      display flex
      justify-content space-between
      line-height 48px
      padding 10px

</style>
