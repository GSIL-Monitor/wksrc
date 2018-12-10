<template>
<div key="goods" class="foods-wrapper">
  <mobile-header header-text="提交订单">
  </mobile-header>
  <items :orderItems="orderItems"></items>
  <div class="submit-container">
    <div class="submit-button">提交订单</div>
  </div>
</div>
</template>

<script>
import MobileHeader from '@/components/header/MobileHeader'
import cartcontrol from '../../../components/cartcontrol/cartcontrol'
import items from '../../../components/order/items'
import store from '@/utils/store'

export default {
  name: 'order-list',
  data() {
    return {
      orderItems: []
    }
  },
  components: {
    cartcontrol,
    items,
    MobileHeader
  },
  created() {
    this.orderItems = store.getCartItems()
  }
}
</script>

<style lang="stylus" scoped >
  @import "../../../common/stylus/variables";
  .foods-wrapper
     flex 1
     height 100vh
     .submit-container
        margin 40px
        text-align center
        position absolute
        bottom 0px
        width 90%
        .submit-button
           height 88px
           line-height 88px
           font-size 36px
           font-weight 500
           width 100%
           text-align center
           border 0.03125rem solid #ececec
           border-radius 15px
           color #fff
           background-color main-red
</style>
