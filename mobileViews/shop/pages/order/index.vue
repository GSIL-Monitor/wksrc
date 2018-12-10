<template>
<div class="order">
    <mobile-header :visible.sync="dialogFormVisible" header-text="订单列表">  </mobile-header>
        <div class="empty" v-if="isShow">
          <div class="image">
            <img src=""/>
          </div>
          <div class="order" @click="toIndex">
             <span class="text">立即下单</span>
          </div>
        </div>
      <div class="container" :scroll-y="true">
        <div class="orderList" v-for="(item,index) in orderList" :key="index">
          <div class="order-title">
            <div class="order-title-restaurantName">
              <span class="name">{{item.name}}</span>
             <span class="iconfont icon-icon icon"></span>
            </div>
            <div class="order-title-state"><!-- 商家已接单 --></div>
          </div>
          <div class="order-content">
            <img class="order-content-restaurantImg" :src="item.icon"/>
            <div class="order-content-info">
              <div class="order-content-info-price">￥ {{item.price}}</div>
              <div class="order-content-info-howToDistribute">待显示的内容</div>
            </div>
          </div>
          <div class="order-desc">共{{item.count}}件商品，应付<span style="font-weight:700;">￥ {{item.count*item.price}}</span></div>
          <div class="order-footer">
            <div class="order-footer-orderAgain">再来一单</div>
            <div class="order-footer-goToComment">去评论</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MobileHeader from '@/components/header/MobileHeader'
import util from '@/mobileViews/shop/utils/util'
import store from '@/utils/store'

export default {
  name: 'order-add',
  components: {
    MobileHeader
  },
  data() {
    return {
      orderList: [],
      isShow: true
    }
  },
  created() {
    try {
      var value = store.getItem('selectFoods')
      console.log(value)
      if (value) {
        this.isShow = false
        this.orderList = value
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        // if (this.hasProps(food)) {
        //   total += food.propPrice * food.count
        // } else {
        total += food.price * food.count
        // }
      })
      return total
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    }
  },

  methods: {
      toIndex() {
          wx.switchTab({
            url: '/pages/home/main',
          })

      }

    }
}
</script>

<style lang="stylus" scoped>
  .empty
    display flex
    flex-direction column
    justify-content center
    align-items center
    margin-top 25%
    .order
      height 68px
      width 240px
      background-color #ffd300
      text-align center
      margin-top 40px
      line-height 68px
      border-radius 5px

  .container
    height: 100%
    .orderList
      width 100%
      padding 15px
      border 100px 0
      border-style solid
      border-color #ECECEC
      .order-title
        width 100%
        height 70px
        line-height 70px
        border-bottom 1px solid #ECECEC
        .order-title-restaurantName
          width 200px
          float left
          height 100%
          font-size 30px
          .name
            padding-right 10px
          .icon
            color #b4b4b4
        .order-title-state
          width 200px
          float right
          color #ffc648
          margin-right -15px
          font-size 28px
      .order-content
        height 250px
        display flex
        align-items center
        .order-content-restaurantImg
          width 125px
          height 125px
        .order-content-info
          font-size 25px
          flex 1
          display flex
          flex-direction column
          .order-content-info-price,.order-content-info-howToDistribute
            height 42px
            line-height 42px
            margin-left 30px
          .order-content-info-price
            color: red
            font-size: 30px
      .order-desc
        float right
        font-size 30px
        width 335px
        margin-bottom 40px
        line-height 30px
        margin-right 10px
      .order-footer
        width 100%
        height 90px
        display flex
        justify-content flex-end
        font-size 28px
        .order-footer-goToComment,.order-footer-orderAgain
          margin-top 15px
          margin-right: 40px
          height 70px
          line-height 70px
          width 200px
          text-align center
          border 1px solid #ECECEC
        .order-footer-orderAgain
          margin-right 20px
        .order-footer-goToComment
          background #FFD161

</style>
