<template>
<div :class="{'cartcontrol':true, 'is-loading':isLoading}">
  <!-- 有规格而且不是弹框 -->
  <div v-if="hasProps && !foodFlg">
    <div class="iconfont props-choose">
      <div v-if="isStockOut">
        <div>已售罄</div>
      </div>
      <div v-else>
        <span  @click="chooseProp">选规格</span>
      </div>
    </div>
  </div >
  <!-- 没有规格或者是产品弹框 -->
  <div v-else>
    <div v-if="isStockOut && !foodFlg">
      <div class="iconfont props-choose">已售罄</div>
    </div>
    <!-- 计重而且最低重量是0 -->
    <div v-else-if="food.isbyMass && food.stepMass==0">
      <div class="cart-count-mass by-mass-input" >
        <input v-model.number="food.count" type="number" :disabled="optDisabled ? true : false" @click="scrollToView($event)" @change="changeCount($event)"/>
      </div>
    </div>
    <!--  正常显示 + -号 -->
    <div v-else >
      <div class="cart-decrease iconfont  icon-jianhao" v-if="food.count != 0" @click.stop="decreaseCart" transition="move"></div>
      <div class="cart-count" v-if="food.count != 0">
        <input v-model.number="food.count" type="number" :disabled="optDisabled ? true : false" @click="scrollToView($event)" @change="changeCount($event)"/>
      </div>
      <div :style="optDisabled ? disableStyle : ''" class="cart-add iconfont icon-jiahao-copy" @click.stop="addCart"></div>
      </div>
    </div>
    <van-dialog
      v-model="countDialogVisible"
      show-cancel-button
      @confirm="confirmChangeCount($event)"
      @cancel="cancelCount"
      >
      <div class="title">
        <div class="name">{{$store.state.app.langSwitched && food.ename ? food.ename : food.name}}
          <span class="now">￥{{food.newPrice || food.propPrice || food.price }}/{{food.unit}}</span>
          <span class="mprice">| vip￥{{food.mpropPrice || food.mPrice}}</span>
        </div>
      </div>
      <van-cell>
        <input v-focus="countDialogVisible" @focus="$event.target.select()" v-model.number="currentCount" type="number" :disabled="optDisabled ? true : false"/>
      </van-cell>
  </van-dialog>
  </div>
</div>
</template>

<script>
// import Vue from 'vue'
import { deepClone } from '@/utils/index'
import { productStock } from '@/api/product'
export default {
  data() {
    return{
      detailShow: false,
      oldCount: 0,
      currentCount: 0,
      countDialogVisible: false
    }
  },
  props: {
    food: {
      type: Object,
      default: () => {}
    },
    propFoods: {
      type: Array,
      default: () => []
    },
    foodFlg: {
      type: Boolean,
      default: false
    },
    noAdd: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }

  },
  methods: {
    chooseProp(event) {
      // this.$set(this.food, 'count', 0)
      this.$emit('chooseProp')
    },
    updatePropFoods() {
      // 当前规格值组合不为空, 而且设置了propFoods属性, 否则不会修改父组件(goods.vue)的propFoods
      // 只需要通过count去修改对应的selectedFood的count就足够(在购物车增减的情况)
      if (this.propFoods && this.food.propList && this.food.propList.length > 0) {
        const pPropIDs = this.food.propList.filter(p => { return p.pv !== undefined }).map(p => {
          return p.pv.vid
        }).join(',')
        const findedIndex = this.propFoods.findIndex(v => {
          return v.pPropIDs === pPropIDs
        })

        const selectedItem = deepClone(this.food)
        selectedItem.pPropIDs = pPropIDs
        selectedItem.price = this.food.propPrice

        if (findedIndex === -1) {
          this.propFoods.push(selectedItem)
        } else {
          // this.propFoods[findedIndex].count += this.countStep
          this.propFoods.splice(findedIndex, 1, selectedItem)
        }
      }
    },
    updateCommonFoods() {
      if (!this.food.propList || this.food.propList.length <= 0) {
        const findedIndex = this.propFoods.findIndex(v => {
          return v.id === this.food.id
        })
        const selectedItem = this.food
        if (findedIndex === -1) {
          this.propFoods.push(selectedItem)
        } else {
          // this.propFoods[findedIndex].count += this.countStep
          this.propFoods.splice(findedIndex, 1, selectedItem)
        }
      }
    },
    addCart(event) {
      // productStock(1, { pid: this.food.id })
      // if (this.hasPa && this.food.count >= 1) {
      //   this.$message.error('特殊商品,数量不能超过1')
      //   return
      // } else if (this.hasPa && this.food.propList.filter(item => {
      //   return item.pv.pa === 1
      // }).some(item => {
      //   return !item.paCount
      // })) {
      //   this.$message.error('所有规格附加参数必填, 且不能为0!')
      //   return
      // }
      if (!this.assertPa()) {
        return
      }
      this.oldCount = 0
      if (!this.food.count) {
        // this.food.count = this.countStep
        this.$set(this.food, 'count', this.countStep)
      } else {
        this.oldCount = this.food.count
        this.food.count += this.countStep
      }
      this.updatePropFoods()
      this.updateCommonFoods()
      this.$emit('changeCount', this.oldCount, this.food.count)
      this.$parent.$emit('changeCount', this.oldCount, this.food.count, this.food)
    },
    decreaseCart() {
      if (this.food.count > 0) {
        this.oldCount = this.food.count
        this.food.count -= Math.min(this.food.count === this.food.stepMass ? this.food.stepMass : this.countStep, this.food.count)
        this.updatePropFoods()
        this.updateCommonFoods()
        this.$emit('changeCount', this.oldCount, Math.max(0, this.food.count))
        this.$parent.$emit('changeCount', this.oldCount, Math.max(0, this.food.count), this.food)
      }
    },
    confirmChangeCount(event) {
      if (this.oldCount!==this.currentCount) {
        this.food.count = this.currentCount
        this.changeCount(event)
      }
    },
    changeCount(event) {
      if (!this.assertPa()) {
        this.food.count = this.oldCount
        return
      }

      if (!this.food.isbyMass && !Number.isInteger(this.food.count)) {
        this.$message.error('不支持按重量输入')
        this.food.count = parseInt(this.oldCount)
      } else if (!this.hasPa && this.food.count !== 0 && !this.food.isbyMass && this.food.count < this.food.stepMass) {
        this.$message.error('不满足最低起购数量')
        this.food.count = parseInt(this.oldCount)
      } else if (this.food.count < 0) {
        this.$message.error('输入数量不合法')
        this.food.count = parseInt(this.oldCount)
      } else {
        this.$emit('changeCount', this.oldCount, this.food.count)
        this.$parent.$emit('changeCount', this.oldCount, this.food.count, this.food)
        this.updateCommonFoods()
        this.updatePropFoods()
      }
    },
    // 校验附加参数是否合法
    assertPa(prop) {
      if (this.hasPa) {
        let hasPaList = this.food.propList.filter(item => {
          if (!item.pv.par) {
            return false
          }
          const rules = item.pv.par.split(':').map(p => parseFloat(p))
          return item.pv.pa === 1 && rules[2] !== 2
        })
        // 如果有prop, 只校验当前的prop
        if (prop) {
          hasPaList = [prop]
        }
        const empty = hasPaList.some(item => {
          return !item.paCount
        })
        let res = true
        hasPaList.some(item => {
          // 没有par参数表示不做限制
          const rules = item.pv.par.split(':').map(p => parseFloat(p))
          res =
            rules[2] !== 2
            ? !empty
            ? item.paCount >= rules[0] || isNaN(rules[0])
            ? item.paCount <= rules[1] || isNaN(rules[1])
            ? rules[2] === 0 && item.paCount % 1 === 0 || 1 ? true
            : '规格值参数只能是整数,请重试'
          : item.pv.vn + '-最大数量/重量为' + rules[1] + ',请重试'
          : item.pv.vn + '-最小数量/重量为' + rules[0] + ',请重试'
          : '所有规格附加参数必填, 且不能为0!' + ',请重试'
          : true
          return res !== true
        })
        if (res !== true) {
          this.$message.error(res)
          return false
        }
      }
      return true
    },
    scrollToView(event) {
      event.target.scrollIntoView()
      this.countDialogVisible = true
      this.oldCount = this.food.count
      this.currentCount = this.food.count
    },
    cancelCount() {
      // if (this.oldCount > 0) {
      //   this.food.count = this.oldCount
      // }
    }
  },
  computed: {
    countStep() {
      // console.log(typeof parseFloat(this.food.stepMass).toFixed(1))
      if (this.food.isbyMass && this.food.stepMass) {
        return parseFloat(this.food.stepMass)
      } else if (this.food.count === 0 && this.food.stepMass) {
        return parseFloat(this.food.stepMass)
      } else {
        return 1
      }
      // return this.food.isbyMass ? parseFloat(this.food.stepMass) : 1
    },
    hasProps() {
      return this.food.pts && this.food.pts.length > 0
    },
    // 是否售罄
    isStockOut() {
      if (this.food.pts && this.food.pts.length > 0) {
        // 如果是规格值弹窗
        if (this.foodFlg) {
          const finded = this.$store.state.shop.stockList.find(item => {
            return this.food.pSkuStr === item.sku
          })
          return finded && parseFloat(finded.n) <= 0
        } else {
          const itemList = this.$store.state.shop.stockList.filter(item => {
            return item.id === this.food.id
          })
          return itemList.length > 0 && itemList.every(item => {
            return parseFloat(item.n) <= 0
          })
        }
      } else {
        return this.food.stockNum !== undefined && this.food.stockNum < 0
      }
    },
    // 选中产品是否有附加参数
    hasPa() {
      return this.hasProps && this.food.propList && this.food.propList.filter(item => {
        return item.pv !== undefined
      }).some(
        item => { return item.pv.pa === 1 })
    },
    disableStyle() {
      return 'color: grey;pointer-events:none;'
    },
    // + - input无法操作
    optDisabled() {
      return this.noAdd || this.food.count < 0
    },
    // 被删除了
    removed() {
      return this.food.count < 0
    }
  },
  created() {

  },
  beforeDestroy() {
    // 在被删除之前, 更新订单项数量 Tue Nov 27 13:05:15 2018
    // if (this.food.count === 0 && this.oldCount > 0 && this.food.fid) {
    //   this.$emit('changeCount', this.oldCount, this.food.count)
    // }
  }
}
</script>

<style lang="stylus">
  @import "../../common/stylus/variables";
  .cartcontrol
    .van-dialog
      .van-field__control, input
        text-align center
        font-size 25px
        width 100%
      .van-dialog__confirm, .van-dialog__confirm:active
        color btn-red
</style>
<style lang="stylus" scoped>
   @import "../../common/stylus/variables";
    .is-loading
      pointer-events none
    .cartcontrol
       font-size 0
       .title
         padding 30px
         border-bottom 1px solid #dddd
         display flex
         justify-content start
         .name
           display block
           font-size 38px
           line-height 38px
           color #333333
           float left
         .mprice
           color #93999f
           float right
         .now
           margin-right 16px
           font-size 38px
           color rgb(240,20,20)
           float right
                  // padding-right 18px
       .cart-decrease, .cart-add
            display inline-block
            font-size 58px
            line-height 58px
            padding 12px
            color rgb(0,160,220)
        .cart-decrease
            display inline-block
            color #c4c4c4
        .cart-count, .cart-count-mass
            display inline-block
            vertical-align top
            width 64px
            padding-top 12px
            line-height 48px
            text-align center
            font-size 30px
            color rgb(147,153,159)
            input
                width 64px
                text-align center
                border 1px solid #ececec
        .cart-count-mass
            margin  0 30px
        .by-mass-input
          width 166px
          margin-bottom 15px
        .paText
            font-size: 32px
        .props-choose
            display inline-block
            font-size 32px
            font-weight 700
            color #fff
            border-radius 18px
            line-height 32px
            background btn-red
            // margin-bottom 14px  //
            margin-top 20px  //
            margin-right: 6px;
            padding 8px
        .cart-add
            display inline-block
            color btn-red
            // color #ffd161
</style>
