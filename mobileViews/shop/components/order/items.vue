<template>
<div key="goods" class="foods-wrapper">
  <!-- <ul> -->
    <!--   <li v-for="(item,id) in orderItems" :key="id" :data-id="id" :id="item.id"  class="food-list " > -->
      <!--     <h1 class="title">{{item.name}}</h1> -->
      <!--   </li> -->
    <!-- </ul> -->
  <ul>
    <li v-for="(food, index) in orderItems" :key="index" :data-id="index"  @click="" >
      <!-- <div class="icon"> -->
        <!--   <img :src="food.picUrl" /> -->
        <!-- </div> -->
      <div class="food-item  border-1px">
        <div class="content">
          <h2 @click="toggleGiftDialog(food)" class="name" :style="food.count < 0 && removedStyle">
            {{$store.state.app.langSwitched && food.ename ? food.ename : food.name}}
            <span v-if="food.count < 0" :style="removedStyle">[已售罄]</span>
            <span v-if="!food.isGift && food.isSubmit===0 && isAddItem" style="color: green;">[加菜]</span>
            <span v-if="food.isGift" style="color: rgb(240,20,20);">[赠]</span>
          </h2>
          <p class="desc">{{food.description}}</p>
          <div class="extra">
            <div v-if="food.count>0">
              <div class="props" v-if="food.propList&&food.propList.length > 0 || food.remark">
                <div v-for="(prop, index) in food.propList" class="prop"><span v-if="isShowProp(prop)">{{prop.pv.vn}}: {{prop.paCount}}</span></div>
                <div class="prop">{{food.remark}}</div>
              </div>
            </div>
            <!-- <span class="count">待显示内容{{food.sellCount}}</span> -->
            <!-- <span class="rating">待显示内容{{food.rating}}</span> -->
          </div>
          <div class="price">
            <span class="now" :style="food.count < 0 && removedStyle">￥{{food.price}}/{{food.unit}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div  class="cartcontrol-wrapper">

            <cartcontrol v-if="type !== 'pay'" :food="food" :foodFlg="true" :noAdd="!food.isbyMass && food.isSubmit === 1" @changeCount="changeItemCount(arguments, food)" :isLoading="btnLoading"></cartcontrol>
            <div v-else>x{{food.count}}</div>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div class="order-desc">
    共<span>{{totalCount.toFixed(2)}}</span>件商品，{{type === 'pay' ? '已付' : '应付'}}
    <span style="font-weight:700;">￥{{totalPrice}}</span>
  </div>

  <van-dialog v-model="isGiftDialogVisible" show-cancel-button @confirm="confirmGiftItems">
    <van-cell-group>
      <van-switch-cell v-for="(item, index) in giftTheItems" :key="index" v-model="item.isGift" @change="giftOrGoback(item)" :title="item.name + '(送)'  " size="1.2rem"/>
    </van-cell-group>
  </van-dialog>
</div>
</template>

<script>
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import notice from "../notice/notice"
import store from '@/utils/store'
import { OrderConfig, orderItemUpdate, orderItemAdd, orderGiftItemAdd, fetchOrder } from '@/api/order'
import { itemsToFoods } from '../../utils/util'

export default {
  props: {
    type: {
      type: String,
      default: 'add'            // add | detail | pay
    },
    orderItems: {
      type: Array,
      default: []
    },
    orderId: {
      type: Number
    },
    payFee: {                   // 实付金额
      type: Number
    }
  },
  data() {
    return {
      btnLoading: false,
      isGiftDialogVisible: false,
      giftTheItems: [],
      selectedFood: {}
    }
  },
  components: {
    cartcontrol
  },
  computed: {
    totalPrice() {
      if (this.payFee > 0) {
        return this.payFee
      }
      let total = 0
      this.orderItems.filter(item => !item.isGift).forEach((food) => {
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
      let count = 0
      this.orderItems.forEach((food) => {
        if (food.count > 0) {
          count += food.count
        }
      })
      return count
    },
    isAddItem() {
      return this.orderItems.some(item => {
        return item.isSubmit === 1
      })
    },
    removedStyle() {
      return 'color: grey;'
    }
  },
  methods: {
    // 是否显示规格值
    isShowProp(prop) {
      if (!prop.pv || prop.pv && prop.pv.pa === 1 && prop.pv.par && parseFloat(prop.pv.par.split(':')[2]) === 2) {
        return false
      } else {
        return true
      }
    },
    // 是否赠送菜弹框
    toggleGiftDialog(food) {
      if (this.type!=='add') {
        return
      }
      if (food.isGift) {
        return
      }
      this.giftTheItems = []
      this.selectedFood = food
      if (food.isbyMass) {
        this.giftTheItems.push(food)
      } else {
        for(var i = 1; i <= food.count; i++) {
          food.isGift = false
          this.giftTheItems.push(Object.assign({}, food))
        }
      }
      this.isGiftDialogVisible = true
    },
    // 是否赠送
    giftOrGoback(food) {
      if (food.isGift) {

      }
    },
    confirmGiftItems() {
      if (this.giftTheItems.every(item => !item.isGift)){
        return
      }
      const giftCount = !this.selectedFood.isbyMass ? this.giftTheItems.filter(item => item.isGift).length : this.selectedFood.count
      const giftFood = Object.assign({}, this.selectedFood)
      giftFood.count = giftCount
      giftFood.isGift = true
      this.giftItemAdd(giftFood)
    },
    giftItemAdd(food) {
      const temp = {
        isGift: food.isGift ? 1 : 0,
        oid: this.orderId,
        cid: this.$store.getters.cid,
        pid: food.pid,
        pNum: food.isbyMass ? 0 : food.count,
        pMass: food.isbyMass ? food.count : 0,
        pPropIDs: food.pPropIDs,
        pPropIDPars: food.pPropIDPars,
        pSkuStr: food.pSkuStr,
        modifyDT: this.$store.state.shop.order.modifyDT
      }
      orderGiftItemAdd(temp).then(response => {
        const newCount = this.selectedFood.count - food.count
        const oldCount = this.selectedFood.count
        const foodAdd = Object.assign({}, this.selectedFood)
        foodAdd.count = newCount
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        this.changeItemCount([oldCount, newCount], foodAdd)
        this.$message.success('赠送成功')
        this.syncOrderInfo()
      })
    },
    syncOrderInfo() {
      fetchOrder(this.orderId).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        const foods = itemsToFoods(response.data.itemList, this)
        this.orderItems.splice(0, this.orderItems.length)
        foods.forEach(item => {
          this.orderItems.push(item)
        })
        this.btnLoading = false
      })
    },
    changeItemCount(args, food) {
      const oldCount = args[0]
      const newCount = args[1]
      this.btnLoading = true
      // console.log(food)
      // console.log(oldCount)
      // console.log(newCount)
      if (this.type === 'add' || (this.type === 'detail' && oldCount > newCount)) {
        // 还没提交订单, 直接调修改数量接口
        const itemId = food.fid ? food.fid  : food.id
        const temp = {
          pNum: food.isbyMass ? 0 : newCount,
          pNumOld: food.isbyMass ? 0 : oldCount,
          pMass: food.isbyMass ? newCount : 0,
          pMassOld: food.isbyMass ? oldCount : 0,
          modifyDT: this.$store.state.shop.order.modifyDT
        }
        orderItemUpdate(itemId, this.orderId, temp)
          .then(response => {
            if (newCount === 0) {
              this.orderItems.splice(this.orderItems.indexOf(food), 1)
              this.$emit('itemDelete')
            }
            this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
            this.btnLoading = false
          })
          .catch(error => {
            food.count = oldCount
            this.syncOrderInfo()
            this.btnLoading = false
          })
      } else if (this.type === 'detail' && oldCount < newCount) {
        // 已经提交订单, 只能减数量, 调加单接口
        const temp = {
          oid: this.orderId,
          cid: this.$store.getters.cid,
          pid: food.pid,
          pNum: food.isbyMass ? 0 : food.count,
          pMass: food.isbyMass ? 0 : food.count,
          pPropIDs: food.pPropIDs,
          pSkuStr: food.pSkuStr,
          modifyDT: this.$store.state.shop.order.modifyDT
          // remarkList TODO
        }
        orderItemAdd(temp).then(response => {
          this.btnLoading = false
          this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        }).catch(error => {
          food.count = oldCount
          this.syncOrderInfo()
          this.btnLoading = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin";
  @import "../../common/stylus/variables";
  .foods-wrapper
     flex 1
     overflow scroll
     margin-top 20px
     // max-height calc(100vh - 6rem - 1.25rem)
     .title
         padding-left 28px
         height 52px
         line-height 52px
         border-left 4px solid #d9dde1
         font-size 24px
         color rgb(147,153,159)
         background #f3f5f7
     .food-item
         display flex
         margin 0 36px 0
         padding-bottom 36px
         border-bottom 1px solid rgba(7,17,27,.1)
         border-1px(rgba(7,17,27,.1))
         &:last-child
             border-none()
             margin-bottom 0
         img
             width: 114px
             height: 114px
         .icon
             flex 0 0 114px
             margin-right 20px
         .content
             flex 1
             .name
                 margin 4px 0 16px 0
                 font-size 28px
                 line-height 28px
                 color rgb(7,17,27)
             .desc, .extra
                 line-height 20px
                 font-size 20px
                 color rgb(147,153,159)
             .desc
                 margin-bottom 16px
             .extra
                 .count
                     margin-right 24px
                 .props
                     display flex
                     flex-wrap wrap
                     height 32px
                     .prop
                         // margin-top -32px
                         // background btn-red
                         color btn-red
                         margin-left 5px
                         font-size 22px
                         padding 8px
                         border-radius 20px

             .price
                 font-weight 700
                 line-height 48px
                 vertical-align top
                 .now
                     margin-right 16px
                     font-size 28px
                     color rgb(240,20,20)
                 .old
                     text-decoration line-through
                     font-size 20px
                     color rgb(147,153,159)
             .cartcontrol-wrapper
                 position absolute
                 right 0
                 top 0
                 bottom 30px
                 margin-top 30px

    .order-desc
      float right
      font-size 30px
      width 435px
      margin 40px
      line-height 30px
      text-align right
      span
        color main-red

</style>
