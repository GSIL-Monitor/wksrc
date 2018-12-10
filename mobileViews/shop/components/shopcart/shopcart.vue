<template>
<div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper" :class="{'highlight': isHighlight}">
          <div class="logo" :class="{'highlight': isHighlight}">
            <i class="iconfont icon-gouwuche icon"  :class="{'highlight': isHighlight}"></i>
          </div>
          <div class="num" v-show="isHighlight">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': isHighlight}">￥{{totalPrice}}</div>
        <div v-if="deskId > 0" class="desc">桌号: {{deskNum}}</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="{'enough':totalPrice>=minPrice}" @click.stop="toPay">
          {{payDesc}}
        </div>
      </div>
    </div>

    <div class="shopcart-list" v-show="listShow">
      <notice></notice>
      <div class="list-header">
        <div class="delete">
          <span class="image"></span>
          <span class="empty" @click="empty">清空购物车</span>
        </div>
      </div>
      <div :scroll-y="true" class="list-content">
        <div v-for="(food,index) in selectFoods" :key="index">
          <div class="food">
            <div class="name" :style="food.count < 0 ? disableStyle : ''" @click="remarkDetail(food)">
              {{$store.state.app.langSwitched && food.ename ? food.ename : food.name}}
            </div>
            <div class="price" :style="food.count < 0 ? disableStyle : ''">
              <span>￥{{(food.price*(food.count > 0 ? food.count : 0)).toFixed(2)}}</span>
            </div>
            <div v-if="food.count > 0" class="cartcontrol-wrapper">
              <cartcontrol :propFoods="selectFoods" :food="food" :foodFlg="!flod" :isLoading="isLoading"/>
            </div>
            <div v-else class="name stock-out">
              {{'售罄' + 'x' + food.count*-1}}
            </div>
          </div>
          <div v-if="food.count > 0">
            <div v-if="food.propList && food.propList.length > 0"  class="props">
              <div v-for="(prop, index) in food.propList" class="prop" >
                <span v-if="isShowProp(prop)">{{prop.pv.vn}}: {{prop.paCount}}</span>
              </div>
              <div class="prop">{{food.remark}}</div>
              <div class="detail-icon"> {{'>'}} </div>
            </div>
            <div v-else  class="props" @click="remarkDetail(food)">
              <div class="prop">备注: &nbsp{{food.remark}}</div>
              <div class="detail-icon"> {{'>'}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="list-mask" v-show="listShow" @click="toggleList"/>
</div>
</template>

<script>
import cartcontrol from "../cartcontrol/cartcontrol"
import notice from "../notice/notice"
import store from '@/utils/store'
import { orderAdd, OrderConfig, orderItemsUpdate } from '@/api/order'
import { setOrderByDesk } from '@/utils/store'
import { itemsToFoods } from '../../utils/util'

export default {

  data() {
    return {
      flod: true,
      type: this.$route.params.type          // newOrder | addItem
    }
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deskId: {
      type: Number,
      default: -1
    },
    deskNum: {
      type: String,
      default: ''
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    }

  },
  methods: {
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.flod = !this.flod
    },
    empty() {
      // this.selectFoods.forEach((food) => {
      //   food.count = 0
      // })
      const list = this.selectFoods.map(food => {
        const newCount = 0
        const oldCount = food.count
        const temp = {
          id: food.fid ? food.fid : food.id,
          pNum: food.isbyMass ? 0 : newCount,
          pNumOld: food.isbyMass ? 0 : oldCount,
          pMass: food.isbyMass ? newCount : 0,
          pMassOld: food.isbyMass ? oldCount : 0
        }
        return temp
      })
      const data = {}
      data.list = list
      data.modifyDT = this.$store.state.shop.order.modifyDT
      const orderId = parseInt(this.$route.params.oid)
      orderItemsUpdate(orderId, data).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        const temp = response.data.list.filter(item => {
          return item.isSubmit === 0
        })
        this.selectFoods.forEach(food => {
          food.count = 0
          food.remark = ''
        })
      })
    },
    hasProps(food) {
      return food.propList && food.propList.length > 0
    },
    // 是否显示规格值
    isShowProp(prop) {
      if (!prop.pv || prop.pv && prop.pv.pa === 1 && prop.pv.par && parseFloat(prop.pv.par.split(':')[2]) === 2) {
        return false
      } else {
        return true
      }
    },
    // 点击备注详情
    remarkDetail(food) {
      this.$emit('remarkDetail', Object.assign({}, food))
    },
    isScanItem() {
      return this.$store.state.shop.config.isPayNow === 2 || this.$store.state.shop.config.isPayNow === 1
    },

    toPay() {
      const orderId = parseInt(this.$route.params.oid)
      if (!this.isScanItem()) {
        this.$router.push({
          path: '/mobile/shop/order/add/' + this.deskId + '/' + orderId
        })
      } else {
        this.$router.push({
          path: '/mobile/shop/pay/' + this.deskId + '/' + orderId
        })
      }
      store.setItem('selectFoods', this.selectFoods)
      // try {
      //   store.setItem('selectFoods', this.selectFoods)
      //   const data = {
      //     sid: this.$store.getters.sid, // 当前店铺id
      //     roomID: this.deskId,          // 房间id
      //     // cid: this.$store.getters.cid, // 当前顾客id
      //     cid: 3, // 当前顾客id
      //     otype: OrderConfig.otype.INSHOP,           // 订单类型
      //     remark: '备注',                            //
      //     opStaf: this.$store.getters.session.rName, // 操作员工号
      //     modifyDT: this.$store.state.shop.order.modifyDT, // 订单更新时间截
      //     itemList: []
      //   }
      //   this.selectFoods.forEach(food => {
      //     if (food.count >= 0) {
      //       const temp = {}
      //       temp.pid = food.id
      //       temp.pNum = food.isbyMass === 0 ? food.count : 0
      //       temp.pMass = food.isbyMass === 1 ? food.count : 0
      //       temp.pPropIDs = food.propIds
      //       temp.pSkuStr = ''   // TODO
      //       temp.remarkList = food.remark ? [food.remark] : undefined
      //       data.itemList.push(temp)
      //     }
      //   })
      //   if (this.type === 'newOrder') { // 添加订单
      //     orderAdd(data).then(response => {
      //       const orderId = response.data.id
      //       const order = { orderId, deskId: this.deskId }
      //       setOrderByDesk(order)
      //       this.$router.push({
      //         path: '/mobile/shop/order/add/' + this.deskId + '/' + orderId
      //       })
      //     })
      //   } else {                // 添加订单项(加单)addItem
      //     const dataAdd = {
      //       oid: parseInt(this.$route.params.oid),
      //       cid: this.$store.getters.cid,
      //       modifyDT: this.$store.state.shop.order.modifyDT, // 订单更新时间截
      //       list: data.itemList
      //     }
      //     orderItemsAdd(dataAdd).then(response => {
      //       const orderId = this.$route.params.oid
      //       this.$router.push({
      //         path: '/mobile/shop/order/add/' + this.deskId + '/' + orderId
      //       })
      //     })
      //   }
      // }
      // catch (e) {
      //   console.log(e)
      // }
    }
  },
  components: {
    cartcontrol,
    notice
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        // if (this.hasProps(food)) {
        //   total += food.propPrice * food.count
        // } else {
        if (food.count > 0) {
          total += food.price * food.count
        }
        // }
      })
      return parseFloat(total.toFixed(2))
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        if (food.count > 0) {
          count += food.count
        }
      })
      return count
    },
    isHighlight() {
      return this.totalCount > 0 || this.selectFoods.length > 0
    },
    payDesc() {
      if (this.$route.params.type === 'addItem' &&
          this.selectFoods !== [] &&
          this.selectFoods.findIndex(item => { return item.isSubmit === 1 }) > -1) {
        return '加菜'
      } else {
        return '选好了'
      }
      // if (this.totalPrice === 0) {
      //   return `￥${this.minPrice}元起送`
      // } else if (this.totalPrice < this.minPrice) {
      //   let diff = this.minPrice - this.totalPrice
      //   return `还差￥${diff}元起送`
      // } else {
      //   return '选好了'
      // }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow() {
      if (!this.isHighlight) {
        this.flod = true
        return false
      }
      let show = !this.flod
      return show
    },
    disableStyle() {
      return 'color: grey;pointer-events:none;'
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/fonts/iconfont.css";
   @import "../../common/stylus/mixin";
   @import "../../common/stylus/variables";
    .shopcart
        position fixed
        z-index 900
        left 0
        bottom 0
        width 100%
        height 96px
        .content
            display flex
            background #141d27
            font-size 0
            .content-left
                flex 1
                .logo-wrapper
                    display inline-block
                    position relative
                    top -20px
                    margin 0 24px
                    padding 12px
                    height 112px
                    width 112px
                    box-sizing border-box
                    vertical-align top
                    border-radius 50%
                    background #141d27
                    .logo
                        width 100%
                        height 100%
                        border-radius 50%
                        background #2b343c
                        text-align center
                        &.highlight
                            // background #ffd161
                            background main-red
                            transform scale(1.2)
                        .icon
                            line-height 88px
                            font-size 48px
                            color #80858a
                            &.highlight
                                color #fff
                    .num
                        position absolute
                        top 0
                        right 0
                        width 48px
                        height 32px
                        line-height 32px
                        text-align center
                        border-radius 32px
                        font-size 18px
                        font-weight 700
                        color #ffffff
                        background rgb(240,20,20)
                        box-shadow 0 8px 16px 0 rgba(0,0,0,.4)
                .price
                    display inline-block
                    font-size 32px
                    vertical-align top
                    line-height 48px
                    margin-top 24px
                    box-sizing border-box
                    padding-right 24px
                    border-right  1px solid rgba(255,255,255,.1)
                    font-weight 700
                    color rgba(255,255,255,.4)
                    &.highlight
                        color #ffffff
                .desc
                    display inline-block
                    vertical-align top
                    text-align center
                    line-height 48px
                    margin 0 0 0 24px
                    line-height 48px
                    color rgba(255,255,255,.4)
                    font-size 32px
            .content-right
                flex 0 0 210px
                width 210px
                .pay
                    text-align center
                    height 96px
                    line-height 96px
                    font-size 24px
                    color rgba(255,255,255,.4)
                    font-weight 700
                    background #2b333b
                    &.enough
                        // background  #ffd161
                        font-size 36px
                        background main-red
                        color #fff
        .shopcart-list
            position absolute
            top  0
            left 0
            z-index -1
            width 100%
            background #ffffff
            transform translate3d(0,-100%,0)
            .list-header
                height 80px
                line-height 80px
                padding 0 36px
                background #f4f4f4
                .delete
                    float right
                    display flex
                    align-items center
                    justify-content center
                    .image
                        display inline-block
                        width 35px
                        height 35px
                        background url(./delete.png)
                        background-repeat no-repeat
                        background-size 100% 100%
                    .empty
                        font-size 30px
                        padding-left 10px
                        color #666
            .list-content
                padding 0 16px
                margin-bottom 46px
                max-height 434px
                overflow scroll
                background #ffffff
                .food
                    position relative
                    padding 46px 0 16px 0
                    box-size border-box
                    border-1px(rgba(rgba(7,17,27,.1)))
                   .name
                        line-height 48px
                        font-size 32px
                        color #333
                    .price
                        position absolute
                        right 230px
                        bottom 16px
                        line-height 48px
                        font-size 32px
                        color #333
                        font-weight 700
                    .cartcontrol-wrapper
                        position absolute
                        right 0px
                        bottom 5px
                        .props-choose
                            margin-bottom: 14px
                    .stock-out
                        position: absolute;
                        right: 20px;
                        bottom: 18px;
                .props
                     display flex
                     flex-wrap wrap
                     color btn-red
                     justify-content space-between
                     .detail-icon
                         font-size 32px
                         line-height 32px
                         margin-right 30px
                         // position absolute
                     .prop
                         // margin-top -32px
                         margin-left 28px
                         font-size 24px
                         line-height 32px
    .list-mask
        position fixed
        top 0
        left 0
        width 100%
        height 100%
        z-index  100
        background #666666
        opacity .7

</style>
