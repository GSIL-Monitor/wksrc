<template>
<div id="app-shop">
  <!-- <v-header :seller="seller"></v-header> -->
  <mobile-header header-text="立即点单">
  </mobile-header>

  <div class="tab">
    <div class="tab-item" :class="{active:changeNav == index}" v-for="(item,index) in navList" :key="index" :data-current="index" @click="switchNav">
      <div @click="showLeftNav=index===0 && !showLeftNav">
        <div :class="{'el-icon-edit-outline': index==0}"></div>
        <span>{{item.name}}</span>
      </div>
    </div>
    </div>
    <goods v-if="changeNav==0" :sort="'default'" :showLeftNav="showLeftNav"></goods>
    <goods v-if="current==1" :sort="'isFine'" :showLeftNav="showLeftNav"></goods>
    <goods v-if="current==2" :sort="'totalSell'" :showLeftNav="showLeftNav"></goods>
    <goods v-if="current==3" :sort="'search'" :showLeftNav="showLeftNav"></goods>
  </div>

</template>
<script>
import header from "@/mobileViews/shop/components/header/header"
import MobileHeader from '@/components/header/MobileHeader'
import goods from "@/mobileViews/shop/components/goods/goods"
import ratings from "@/mobileViews/shop/components/ratings/ratings"
import seller from "@/mobileViews/shop/components/seller/seller"
import fly from '@/mobileViews/shop/utils/fly'
import { parseTime } from '@/utils'
import { fetchOrderList, fetchOrder, orderAdd, OrderConfig } from '@/api/order'

export default {
  name: 'shop-index',
  data() {
    return {
      goods: {},
      seller: {},
      navList: [{ name: '菜单' }, { name: '总厨推荐' }, { name: '销售排行' }, { name: '搜索' }],
      showLeftNav: true,
      changeNav: 0,
      current: null,
      deskId: parseInt(this.$route.params.did),
      deskNum: '',
    }
  },
  methods: {
    switchNav(e) {
      const current = e.currentTarget.dataset.current
      this.changeNav = current
      this.current = current
      //  console.log(current)
    },
    // 新建空单
    newOrder() {
      const sid = this.$store.getters.sid
      const data = {
        sid: parseInt(sid),                // 当前店铺id
        roomID: this.deskId,               // 房间id
        cid: this.$store.getters.cid,      // 当前顾客id
        otype: OrderConfig.otype.INSHOP,   // 订单类型
        remark: '',                        //
        itemList: []
      }
      orderAdd(data).then(response => {
        const orderId = response.data.id
        this.orderId = orderId
        this.type = 'newOrder'
        fetchOrder(orderId).then(response => {
          const currentOrder = response.data
          this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
          this.$route.params.type = 'newOrder'
          this.$route.params.oid = currentOrder.id
          this.$route.params.did = currentOrder.roomID
          this.deskNum = response.data.roomNumber
        })
      })
    }
  },
  created() {
    // fly.get('sell#!method=get').then((res)=>{
    //          this.goods = res.data.goods
    //          this.seller = res.data.seller
    //        }).catch((e)=>{
    //        console.log(e)
    //        })
  },
  // mounted() {
  //   const today = parseTime(Date.now(), '{y}-{m}-{d}')
  //   const query = this.$route.params
  //   // 只有桌号
  //   if (query.did && !query.oid) {
  //     fetchOrderList({ roomID: query.did, createDT: today, itemList: 1 })
  //       .then(response => {
  //         const currentOrder = response.data.list.find((item) => {
  //           return item.payflag === 0
  //         })
  //         if (currentOrder !== undefined) {
  //           this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
  //           const submitted = currentOrder.itemList.findIndex(item => {
  //             return item.isSubmit === 1
  //           }) > -1
  //           this.$route.params.type = submitted ? 'addItem' : 'newOrder'
  //           this.$route.params.oid = currentOrder.id
  //           this.$route.params.did = currentOrder.roomID
  //           this.type = this.$route.params.type
  //           this.orderId = this.$route.params.oid
  //           this.deskNum = currentOrder.roomNumber
  //         } else {
  //           this.newOrder()
  //         }
  //       })
  //   }
  //   // 桌号, 单号都有
  //   if (query.did && query.oid) {
  //     fetchOrder(query.oid)
  //       .then(response => {
  //         const currentOrder = response.data
  //         this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
  //         if (currentOrder !== undefined && currentOrder.payflag === 0) {
  //           const submitted = currentOrder.itemList.findIndex(item => {
  //             return item.isSubmit === 1 }) > -1
  //           this.$route.params.type = submitted ? 'addItem' : 'newOrder'
  //           this.$route.params.oid = currentOrder.id
  //           this.$route.params.did = currentOrder.roomID
  //           this.type = this.$route.params.type
  //           this.orderId = this.$route.params.oid
  //           this.deskNum = currentOrder.roomNumber
  //         } else {
  //           this.$message({
  //             message: '订单已完成, 或不存在,请选择其他订单',
  //             type: 'error',
  //             duration: 2000
  //           })
  //           this.$route.push('/mobile/shop/order/list')
  //         }
  //       })
  //   }
  // }
  // ,
  components: {
    "v-header":header,
    MobileHeader,
    goods:goods,
    ratings: ratings,
    seller: seller,
  }
}
</script>
<style lang="stylus" scoped>
#app-shop
  // height 100vh
  width 100%
  overflow hidden
  .el-icon-edit-outline
    color grey
    font-size 32px
  .tab
    display flex
    justify-content space-around
    align-items center
    width 100%
    height 80px
    text-align center
    position relative
    &:after
      display block
      position absolute
      left 0
      bottom 0
      width 100%
      border-top 1px solid rgba(7, 17, 27, 0.1)
      content ''
    .tab-item
      font-size 36px
      color rgb(77,85,93)
      line-height 36px
    .active
      color rgb(240, 20, 20)
      font-weight 500

</style>
