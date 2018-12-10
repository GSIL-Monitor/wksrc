<template>
<div key="pay-goods" class="foods-wrapper1">
  <mobile-header header-text="支付详情"></mobile-header>
  <items :orderItems="orderItems" :orderId="dataForm.id" :type="'pay'" :payFee="payInfo.sumFee - dataForm.inputdiscVal"></items>
  <div class="payInfo">
    <div class="desc">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="5rem">
        <!-- <el-form-item label="订单类型" prop="otype"> -->
          <!--   &nbsp&nbsp{{ payInfo.otype | displayNameFilter(oTypeOptions) }} -->
          <!-- </el-form-item> -->
        <el-form-item label="顾客编号">
          <el-input placeholder="请输入会员手机/编号" v-model.number="vid" @click.native="customerEdit"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="oPayType" >
          <el-select clearable v-model="dataForm.oPayType" placeholder="请选择支付方式" class="filter-item" @visible-change="popupShow=!popupShow">
            <el-option v-for="(item,index) in payInfo.oPayTypeList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣方式" prop="discountType" >
          <el-select clearable v-model="dataForm.discountType" placeholder="" class="filter-item" @visible-change="popupShow=!popupShow">
            <el-option v-for="(item,index) in discountTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免金额" prop="inputdiscVal"
                      :rules="[{ required: dataForm.discountType>0, message: '请输入减免金额', trigger: 'blur' }]" v-if="dataForm.discountType == 2">
          <el-input placeholder="请输入减免金额" v-model.number="dataForm.inputdiscVal" ></el-input>
        </el-form-item>

        <div v-if="dataForm.oPayType == 99">
        <el-form-item label="现金支付" prop="payFeeXJ" >
          <el-input placeholder="请输入现金组合支付金额" v-model="dataForm.payFeeXJ" ></el-input>
        </el-form-item>
        <el-form-item label="会员余额" prop="byLfund" >
          <el-input placeholder="请输入会员余额组合支付金额" v-model="dataForm.byLfund" ></el-input>
        </el-form-item>
        <el-form-item label="刷卡" prop="payFeeSK" >
          <el-input placeholder="请输入刷卡组合支付金额" v-model="dataForm.payFeeSK" ></el-input>
        </el-form-item>
        <el-form-item label="消费券" prop="payFeeXFQ" >
          <el-input placeholder="请输入消费券组合支付金额" v-model="dataForm.payFeeXFQ" ></el-input>
        </el-form-item>
        <el-form-item label="一卡通" prop="payFeeYKT" >
          <el-input placeholder="请输入一卡通组合支付金额" v-model="dataForm.payFeeYKT" ></el-input>
        </el-form-item>
        <el-form-item label="网购" prop="payFeeWG" >
          <el-input placeholder="请输入网购组合支付金额" v-model="dataForm.payFeeWG" ></el-input>
        </el-form-item>
        
        <!-- <el-form-item label="扫码支付方式" prop="onlinePayType" >
          <el-select clearable v-model.number="dataForm.onlinePayType" placeholder="如果有扫码支付请选择类型" class="filter-item" @visible-change="popupShow=!popupShow">
            <el-option label="微信扫码" value="0"></el-option>
            <el-option label="支付宝扫码" value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扫码" prop="byOnline" >
          <el-input placeholder="请输入扫码组合支付金额" v-model="dataForm.byOnline" ></el-input>
        </el-form-item> -->
        </div>


        <el-form-item label="订单备注" prop="remark" >
          <el-input placeholder="请输入备注" v-model="dataForm.remark" ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <van-dialog v-model="custEdit" show-cancel-button @cancel="custInfo={}" @confirm="changeCID">
      <van-cell-group>
        <van-field v-model.number="vid" placeholder="请输入会员号/手机号" clearable @focus="fetchCustInfo" @change="fetchCustInfo" :error-message="isVidError"/>
        <van-cell title="手机号码" :value="custInfo.phone" />
        <van-cell title="会员名称" :value="custInfo.name" />
      </van-cell-group>
    </van-dialog>
  </div>
  <div class="submit-container">
    <div class="submit-button" @click="paySubmit">结账</div>
  </div>
  <van-popup v-model="popupShow" :close-on-click-overlay="false">  </van-popup>
</div>
</template>

<script>
import MobileHeader from '@/components/header/MobileHeader'
import items from '../../components/order/items'
import { orderPay, fetchOrderPayInfo, fetchOrder, OrderConfig, orderChangeCID } from '@/api/order'
import { itemsToFoods } from '../../utils/util'
import { displayNameFilter } from '@/filters'
import { dict } from '@/store'
import { fetchGetCustomer } from '@/api/customer'

const defaultForm = {
  sessionToken:	undefined,    //	表单token(从获取订单结帐信息api返回)
  modifyDT: undefined,
  oPayType:	0,                //	订单支付方式
  discountType:	0,            //	折扣方式：0,系统默认 2,减免金额
  inputdiscVal:	undefined,    //	录入的折扣值 discountType非0时必须
  byScore:	undefined,        //	使用积分支付的金额
  payFeeXJ:	undefined,        //	现金支付的金额(组合支付用)
  payFeeSK:	undefined,        //	刷卡金额(组合支付用)
  payFeeYKT:	undefined,      //	一卡通金额(组合支付用)
  payFeeWG:	undefined,        //	网购金额(组合支付用)
  byLfundSrv:	undefined,	//	服务费余额支付(店铺启用了服务费功能时用)
  byLfund:	undefined,    //	会员余额支付的金额(组合支付用)
  // byOnline:	undefined,    //	扫码支付金额(组合支付用)
  // onlinePayType: undefined,   //扫码支付方式:0微信 ;20 支付宝(组合支付用)
  remark:	undefined,      //	订单备注
  backURL:	undefined     //	支付成功跳转地址。
}
const defaultPayInfo = {
  sessionToken:	undefined, //	表单token(结帐表单提交时需要传回该值)
  oPayTypeList:	undefined, //	支付方式信息列表
  id:	undefined,           //	订单ID
  number:	undefined,       //	订单号
  sid:	undefined,         //	店铺id
  roomID:	undefined,       //	关联餐桌(房间)id(负值为虚拟桌号)
  roomName:	undefined,     //	关联餐桌(房间)号
  cid: undefined,          //	顾客id
  vid: undefined,          //	顾客vid(前端id)
  otype: undefined,        //	订单类型
  sumFee:	undefined,       //	订单总价
  createDT:	undefined, //	下单时间(返回格式样例：2018-09-22 13:03:26)
  remark:	undefined,   //	订单备注
  itemList:	undefined, //	已提交的订单项目列表
  warnInfo:	undefined //	警告信息(若存在未提交订单项目,提醒结帐后会自动清除未提交订单项)
}
export default {
  name: 'pay-index',
  components: {
    items,
    MobileHeader
  },
  data() {
    return {
      dataForm: {},
      orderItems: [],
      payInfo: {},
      oTypeOptions: [],
      discountTypeOptions: [],
      timeout: undefined,
      tcount: undefined,
      rules: {
        inputdiscVal: [{ type: 'integer', fullField: '店铺' }]
      },
      vid: undefined,
      custEdit: false,
      custInfo: {},
      isVidError: '',
      popupShow: false          // 选择框蒙层
    }
  },
  methods: {
    paySubmit() {
      const orderId = this.payInfo.id
      this.dataForm.modifyDT = this.$store.state.shop.order.modifyDT
      orderPay(orderId, this.dataForm).then(response => {
        const data = response.data
        if (data.jumpType === OrderConfig.WECHAT) {
          data.paymentParam.success = (res) => {
            this.$router.push({
              path: '/mobile/shop/pay/payed',
              query: { jumpType: data.jumpType, oid: orderId }
            })
          }
        } else {
          this.$router.push({
            path: '/mobile/shop/pay/payed',
            query: { jumpType: data.jumpType, oid: orderId }
          })
        }
      }).catch(res => {
        console.log(res)
        this.initPayInfo()
      })
    },
    initPayInfo() {
      this.dataForm = Object.assign({}, defaultForm)
      const orderId = this.$route.params.oid
      fetchOrderPayInfo(orderId).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        this.payInfo = response.data
        this.orderItems = itemsToFoods(this.payInfo.itemList, this)
        this.dataForm.sessionToken = this.payInfo.sessionToken
        dict('oType').then(response => {
          this.oTypeOptions = response
        })
        dict('discountType', 0, this.$store.getters.session.uid, this.$store.getters.session.sid).then(response => {
          this.discountTypeOptions = response
        })
        this.vid = this.payInfo.vid
      })
    },
    customerEdit() {
      this.custEdit = true
      this.fetchCustInfo()
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
      const orderId = this.payInfo.id
      data.modifyDT = this.$store.state.shop.order.modifyDT
      data.oid = orderId
      data.cid = this.custInfo.id
      orderChangeCID(data).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
      })
    }
  },
  created() {
    this.initPayInfo()
  },
}
</script>
<style lang="stylus" scoped >
  @import "../../common/stylus/variables";
  .foods-wrapper1
     flex 1
     height calc(100vh)
     overflow scroll
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
        .after-submit
          display flex
          justify-content space-around
        .add-item, .to-pay
           width 45%
   .payInfo
      margin 36px
      // margin-top 160px


.el-select-dropdown__item
    line-height 64px
    height 64px
    font-size 32px!important

</style>
