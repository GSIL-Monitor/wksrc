<template>
<div key="goods" class="foods-wrapper1">
  <mobile-header :visible.sync="dialogFormVisible" actionIcon="iconfont icon-print" header-text="订单详情"></mobile-header>
  <items :orderItems="orderItems" :orderId="orderId" :type="ispay" @itemDelete="onItemDelete"></items>
  <div v-if="!addItemSubmit">
    <!-- <payinfo :payInfo="payedInfo" @infoClick="infoClick(arguments, $event)"></payinfo> -->
    <van-cell-group>
      <van-cell title="顾客ID" :value="custInfo.vid" is-link @click="customerEdit"/>
      <van-cell v-if="custInfo.phone" title="手机号码" :value="custInfo.phone" :clickable="false" />
      <van-cell v-if="custInfo.name" title="会员名称" :value="custInfo.name"  :clickable="false" />
      <van-cell title="订单编号" :value="orderInfo.number" :clickable="false" />
      <van-cell title="下单时间" :value="orderInfo.createDT"  :clickable="false"/>
      <van-cell v-if="orderInfo.payDT" title="支付时间" :value="orderInfo.payDT"  :clickable="false"/>
      <van-cell title="就餐人数" :value="orderInfo.custNum" :clickable="false" />
      <van-cell title="支付状态" :value="payStatusText"  :clickable="false"/>
      <!-- <van-cell title="支付详情" :value="payInfo" is-link :clickable="false"/> -->
      <van-cell v-if="hasIsHold" title="是否叫起" is-link @click="isHoldDialogVisible=true"/>
      <van-field v-if="orderInfo.remark" v-model="orderInfo.remark" label="订单备注" type="textarea" placeholder="" rows="1" autosize disabled input-align="right"/>
    </van-cell-group>
    <van-dialog v-model="isHoldDialogVisible" show-cancel-button title="叫起" message="选择叫起, 将会通知厨房出菜" @confirm="confirmIsUp">
    </van-dialog>
    <van-dialog v-model="custEdit" show-cancel-button @cancel="custInfo={}"  @confirm="changeCID">
      <van-cell-group>
        <van-field v-model="vid" placeholder="请输入会员号/手机号" clearable @focus="fetchCustInfo" @change="fetchCustInfo" :error-message="isVidError"/>
        <van-cell title="手机号码" :value="custInfo.phone" />
        <van-cell title="会员名称" :value="custInfo.name" />
      </van-cell-group>
    </van-dialog>
  </div>
  <div v-else>
    <van-cell-group>
      <van-cell v-if="!isPayNow2" title="是否待起" :value="isHoldStatus" is-link @click="isHoldDialogVisible=true"/>
      <van-field v-model="orderInfo.custNum" label="就餐人数" placeholder="请输入就餐人数方便配送餐具" input-align="right"/>
      <van-field v-model="orderInfo.remark" label="订单备注" type="textarea" placeholder="请输入订单备注" rows="1" autosize input-align="right"/>
    </van-cell-group>
    <van-dialog v-model="isHoldDialogVisible" show-cancel-button title="待起" message="选择待起, 提交订单或加单后将不会马上做菜, 会准备好食材,等待客人叫起操作再上菜" @confirm="confirmIsHold" :confirmButtonText="isHold ? '取消待起' : '确认'">
    </van-dialog>
  </div>

  <div class="submit-container">
    <!-- 有提交的订单项包括第一次提交订单 -->
    <div v-if="!isPayNow2 && orderInfo.status===1 && orderInfo.payflag===0 && orderInfo.itemList.length>=0" class="after-submit">
      <div class="add-item" @click="switchAddItem(orderInfo)">继续加菜</div>
      <div class="to-pay"  @click="orderSubmit">{{submitText}}</div>
    </div>
    <!-- 已经支付 -->
    <div class="after-submit"  v-if="this.orderInfo.payflag!==0">
      <div class="add-item" @click="handleOrderPrint">打印订单</div>
      <div class="to-pay"  @click="handleOrderPayUndo">反结账</div>
    </div>
    <!-- 即付快餐模式 | 即付餐厅模式 -->
    <div class="after-submit" v-if="(isPayNow2 || this.orderInfo.status===0) && this.orderInfo.payflag===0">
      <div class="add-item">
        <router-link :to="'/mobile/shop/index/addItem/' + orderInfo.roomID + '/' + orderInfo.id">加单
      </router-link></div>
      <div class="to-pay"><router-link :to="'/mobile/shop/pay/' + orderInfo.roomID + '/' + orderInfo.id">结账
      </router-link></div>
    </div>

  </div id="chooes">

  <van-dialog v-model="dialogFormVisible" show-cancel-button title="楼面单补打"
              :message="'此操作会重新打印订单号为: '+this.orderInfo.id +'的楼面订单'"
              @confirm="orderFBRePrintv"/>
  <van-dialog v-model="printDialogVisible" show-cancel-button title="结账单打印"
              message="提示此操作会从新打印订单"
              @confirm="printOrder"/>
  <van-dialog v-model="unDoDialogVisible" show-cancel-button title="你确定要反结账吗？" @confirm="payUndo">
    <van-cell-group>
      <van-field size="large" v-model="PayUndoQuery.password" label="密码" type="password" placeholder="请输入反结帐密码" input-align="right"/>
    </van-cell-group>
  </van-dialog>
</div>
</template>

<script>
import MobileHeader from '@/components/header/MobileHeader'
import cartcontrol from '../../../components/cartcontrol/cartcontrol'
import items from '../../../components/order/items'
import store from '@/utils/store'
import {dict} from '@/store'
import { itemsToFoods } from '../../../utils/util'
import payinfo from '../../../components/order/payinfo'
import { fetchOrder, orderSubmit, OrderConfig, orderPayUndo, orderRePrint, srvStart, orderSrv, orderChangeCID } from '@/api/order'
import { fetchGetCustomer } from '@/api/customer'
import { orderFBRePrint} from '@/api/order'

const orderInfo = {
  id:	undefined,       //	订单ID
  number:	undefined,   //	订单号
  sid:	undefined,     //	店铺id
  roomID:	undefined,   //	关联餐桌(房间)id(负值为虚拟桌号)
  cid:	undefined,     //	顾客id
  otype:	undefined,   //	订单类型
  status:	undefined,   //	订单状态
  sumFee:	undefined,   //	订单总价
  createDT:	undefined, //	下单时间(返回格式样例：2018-09-22 13:03:26)
  remark:	undefined,   //
  custNum:	undefined, // 就餐人数
  opStaf:	undefined,   //	操作员
  itemList:	[]         //	项目列表(若为空，表示空订单)
}

const itemInfo = {
  id:	undefined,              //	订单项ID
  pid:	undefined,            //	商品ID
  pName:	undefined,          //	商品名称
  pUnit:	undefined,          //	商品单位
  pNum:	undefined,            //	商品数量(若按数量计，重量必须为0)
  pMass:	undefined,          //	商品重量(若按重量计价，数量必须为0)
  pProps:	undefined,          //	商品规格
  pPropIDs:	undefined,        //	商品规格对应的ID
  pSkuStr:	undefined,        //	商品SKU串(若不启用sku库存,传入空串)
  pPrice:	undefined,          //	商品单价
  totalFee:	undefined,        //	费用小计
  isSubmit:	undefined,        //	菜单项目是否已提交:1 已提交 0 未提交
  remarkList:	[]              //	菜品备注信息，数组长度不能大于pNum
}
export default {
  name: 'order-add',
  data() {
    return {
      orderItems: [],
      orderId: parseInt(this.$route.params.oid),
      deskId: parseInt(this.$route.params.did),
      orderInfo: orderInfo,
      itemInfo: itemInfo,
      payedInfo: [],
      payTypeOptions: [],
      ispay:undefined,
      PayUndoQuery:{
        password:undefined,
        oid:undefined
      },
      dialogVisible:false,
      dialogFormVisible:false,
      printDialogVisible: false,
      unDoDialogVisible: false,
      isPrint:undefined,
      isHoldDialogVisible: false,
      isHold: 0,
      custEdit: false,
      vid: undefined,
      custInfo: {},
      isVidError: ''
    }
  },
  components: {
    cartcontrol,
    items,
    MobileHeader,
    payinfo
  },
  created() {
    this.vid = this.$store.getters.cid
    this.fetchOrderInfo()
    // this.orderItems = store.getCartItems()
  },
  methods: {
    fetchOrderInfo() {
      fetchOrder(this.orderId).then(response => {
        this.orderInfo = Object.assign({}, response.data)
        this.$store.commit('SET_MODIFYDT', this.orderInfo.modifyDT)
        this.composeInfo(this.orderInfo)
        this.initCustomer()
        dict('payType', 0, this.$store.getters.session.uid, -1).then(response => {
          this.payTypeOptions = response
        })
        this.$store.dispatch('GetProductList').then(response => {
          this.orderItems = itemsToFoods(this.orderInfo.itemList || [], this)
        })
        this.ispay = this.orderInfo.payflag != 0 ?'pay':undefined
      })
    },
    composeInfo(orderInfo) {
      this.payedInfo = [
        { name: '顾客ID', key: 'id', value: this.$store.getters.cid, edit: true },
        { name: '订单编号', key: 'orderNum', value: orderInfo.number },
        { name: '下单时间', key: 'createDT', value: orderInfo.createDT },
        { name: '支付时间', key: 'payDT', value: orderInfo.payDT },
        { name: '支付状态', key: 'payedMsg', value: this.payedMsg },
        { name: '是否叫起', key: 'isHold', value: '叫起' }
      ]
    },
    initCustomer() {
      fetchGetCustomer(this.orderInfo.cid).then(response => {
        this.custInfo = response.data
        this.vid = this.custInfo.vid
      })
    },
    orderSubmit() {
      const data = {
        isHold: this.isHold,
        modifyDT: this.$store.state.shop.order.modifyDT,
        remark: this.orderInfo.remark,
        custNum: this.orderInfo.custNum
      }
      orderSubmit(this.orderId, data).then(response => {
        this.orderInfo.status = OrderConfig.status.CONFIRMED
        this.$message.success(response.msg)
        this.fetchOrderInfo()
      })
    },
    toIndex() {
      this.$router.push('/mobile/shop/order/list')
    },
    handleOrderPayUndo(){
      this.unDoDialogVisible = true
      this.PayUndoQuery.oid = this.orderId
      this.isPrint = false;
    },
    handleOrderPrint(){
      this.printDialogVisible = true
      this.PayUndoQuery.oid = this.orderId
      this.isPrint = true
    },
    payUndo(){
      orderPayUndo(this.PayUndoQuery).then(response => {
        this.unDoDialogVisible = false
        // this.$router.go(-1)
        this.fetchOrderInfo()
        this.$notify({
			    title: '成功',
			    message: response.msg,
			    type: response.code === 200?'success' : 'danger',
			    duration: 2000
        })
      })
    },
    handleClose(){
      this.dialogVisible = false
    },
    printOrder(){
      this.printDialogVisible = false
      this.PayUndoQuery.password = 123456
      orderRePrint(this.PayUndoQuery).then(response => {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: response.code === 200?'success' : 'danger',
          duration: 2000
        })
      })
    },
    switchAddItem(orderInfo) {
      this.$router.push({
        path: '/mobile/shop/index/addItem/' + orderInfo.roomID + '/' + orderInfo.id
      })
    },
    confirmIsHold() {
      this.isHold = this.isHold === 1 ? 0 : 1
    },
    confirmIsUp() {
      orderSrv(this.orderInfo.id).then(response => {
        const serveItems = response.data.list
        const ids = serveItems.filter(item => {
          // return item.isHold === 1
          return true
        }).map(item => {
          return item.id
        }).join(',')
        srvStart(ids).then(response => {
          this.$toast.success('叫起成功')
        })
      })
    },
    infoClick(args) {
    },
    customerEdit() {
      this.custEdit = true
      this.fetchCustInfo()
    },
    onItemDelete() {
      this.fetchOrderInfo()
    },
    fetchCustInfo() {
      this.isVidError = ''
      if (!parseInt(this.vid)) {
        this.isVidError = '输入格式错误'
      } else {
        fetchGetCustomer(parseInt(this.vid)).then(response => {
          this.custInfo = response.data
        }).catch(_error => {
          this.isVidError = '会员不存在'
        })
      }
    },
    changeCID() {
      const data = {}
      data.modifyDT = this.$store.state.shop.order.modifyDT
      data.oid = this.orderId
      data.cid = this.custInfo.id
      orderChangeCID(data).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
      })
    },
    //补打
    orderFBRePrintv(){
      this.dialogFormVisible = false
      orderFBRePrint({oid:this.orderInfo.id}).then(response => {
        this.$message({
          message: response.msg,
          type: response.code === 200 ? "success" : "denger"
        });
      })
    },
  },
  computed: {
    payedMsg() {
      if (this.orderInfo.payflag === OrderConfig.payFlag.UNPAY) {
        return '待支付'
      }
      if (this.orderInfo.payflag === OrderConfig.payFlag.PAYED) {
        return '支付成功'
      }
      if (this.orderInfo.payflag === OrderConfig.payFlag.HANG) {
        return '挂账成功'
      }
    },
    payStatusText() {
      const finded = this.payTypeOptions.find(v => {
        return v.id === this.orderInfo.oPayType
      })
      return finded ? finded.name + '('+ this.orderInfo.payFee +')' : '未支付'
    },
    // 支付详情
    payInfo() {
      return this.orderInfo.payflag ? this.payStatusText + '('+ this.orderInfo.payFee +')' : ''
    },
    submitText() {
      if (this.orderInfo.status === 1 && this.orderInfo.payflag === 0 && this.orderInfo.itemList.some(item => item.isSubmit === 1)) {
        return '确认加单'
      }
      if (this.orderInfo.status === 1 && this.orderInfo.payflag === 0 && this.orderInfo.itemList.every(item => item.isSubmit === 0)) {
        return '提交订单'
      }
    },
    addItemSubmit() {
      return this.orderInfo.status === 1 && this.orderInfo.payflag === 0 && this.orderInfo.itemList.some(item => item.isSubmit === 0)
    },
    isHoldStatus() {
      if (this.isHold === 0) {
        return '否'
      } else {
        return '是'
      }
    },
    // 是否有已挂起的订单项
    hasIsHold() {
      return this.orderInfo.itemList && this.orderInfo.itemList.some(item => {
        return item.isHold === 1
      }) && !this.isPayNow2
    },
    isPayNow2() {
      return this.$store.state.shop.isPayNow2
    },

  }
}
</script>

<style lang="stylus" scoped >
  @import "../../../common/stylus/variables";
  .foods-wrapper1
     flex 1
     // height 100vh
     overflow hidden
     .submit-container
        margin 40px
        text-align center
        // position absolute
        bottom 0px
        width 90%
        .submit-button , .add-item, .to-pay
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
        .add-item
          background-color green
        .after-submit
          display flex
          justify-content space-around
        .add-item, .to-pay
          flex 1
        .to-pay
          margin-left 20px
</style>

<style lang="stylus">
  @import "../../../common/stylus/variables";
.can-button
  width 35%
  font-size 1rem
  margin-top 20px

.sub-button
  width 35%
  background green
  color #fff
  font-size 1rem
  margin-top 20px

.foods-wrapper1
  .van-dialog__message--has-title
    color main-red
    font-size 20px
</style>
