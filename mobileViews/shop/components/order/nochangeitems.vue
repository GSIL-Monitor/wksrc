<template>
<div key="goods" class="foods-wrapper">
  <!-- <ul> -->
    <!--   <li v-for="(item,id) in orderItems" :key="id" :data-id="id" :id="item.id"  class="food-list " > -->
      <!--     <h1 class="title">{{item.name}}</h1> -->
      <!--   </li> -->
    <!-- </ul> -->
  <ul>
    <li v-for="(food, index) in orderItems" :key="index" :data-id="index"  @click="" class="food-item  border-1px">
      <div class="icon">
        <img :src="food.picUrl" />
      </div>
      <div class="content">
        <h2 class="name">{{food.name}} </h2>
        <p class="desc">{{food.description}}</p>
        <div class="extra">
          <div v-if="food.count>0 && food.propList">
            <div class="props">
              <div v-for="(prop, index) in food.propList" class="prop">{{prop.pv.vn}}</div>
              <div class="prop">{{food.remark}}</div>
            </div>
          </div>
          <!-- <span class="count">待显示内容{{food.sellCount}}</span> -->
          <!-- <span class="rating">待显示内容{{food.rating}}</span> -->
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}/{{food.unit}}</span>
          <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
        </div>
        <div  class="cartcontrol-wrapper">

          <cartcontrol v-if="type !== 'pay'" :food="food" :foodFlg="true" :noAdd="food.isSubmit" @changeCount="changeItemCount(arguments, food)"></cartcontrol>
          <div v-else>x{{food.count}}</div>
        </div>
      </div>
    </li>
  </ul>
  <div class="order-desc">
    共<span>{{totalCount}}</span>件商品，应付
    <span style="font-weight:700;">￥{{totalPrice}}</span>
  </div>
</div>
</template>

<script>
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import notice from "../notice/notice"
import store from '@/utils/store'
import { OrderConfig, orderItemUpdate, orderItemAdd } from '@/api/order'

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
    }
  },
  data() {
    return {

    }
  },
  components: {
    cartcontrol
  },
  computed: {
    totalPrice() {
      let total = 0
      this.orderItems.forEach((food) => {
        // if (this.hasProps(food)) {
        //   total += food.propPrice * food.count
        // } else {
        total += food.price * food.count
        // }
      })
      return total
    },
    totalCount() {
      let count = 0
      this.orderItems.forEach((food) => {
        count += food.count
      })
      return count
    }
  },
  methods: {
    changeItemCount(args, food) {
      const oldCount = args[0]
      const newCount = args[1]
      // console.log(food)
      // console.log(oldCount)
      // console.log(newCount)
      if (this.type === 'add' || (this.type === 'detail' && oldCount > newCount)) {
        // 还没提交订单, 直接调修改数量接口
        const itemId = food.id
        const temp = {
          pNum: food.isbyMass ? 0 : newCount,
          pNumOld: food.isbyMass ? 0 : oldCount,
          pMass: food.isbyMass ? newCount : 0,
          pMassOld: food.isbyMass ? oldCount : 0
        }
        orderItemUpdate(itemId, this.orderId, temp).catch(error => {
          console.log(error)
          food.count = oldCount
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
          pSkuStr: food.pSkuStr
          // remarkList TODO
        }
        orderItemAdd(temp)
      }
      console.log('add order item')
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
         margin 36px
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
                 margin-top 70px

    .order-desc
      float right
      font-size 30px
      width 335px
      margin 40px
      line-height 30px
      text-align right
      span
        color main-red

</style>
