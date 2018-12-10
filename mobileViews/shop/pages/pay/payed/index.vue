<template>
  <div>
    <mobile-header :isPreventReturn="true" header-text="支付结果"></mobile-header>
<div class="payed-wrapper" >
  <div class="">
    <div :class="{ 'payed-status':true, payedSuccess: payedFlag===1 || payedFlag===2 }">
      <i class="iconfont icon-right_fill"></i>
    </div>
    <div class="payed-msg">{{ payedMsg }}</div>
  </div>
  <div class="payed-total">
    <span>{{payedFlag==0 ? '' : '已支付'}}￥{{totalPrice}}</span>
  </div>
  <payinfo :payInfo="payedInfo"></payinfo>
  <div class="confirm-btn" @click="confirmFinish">完成</div>
  <div v-if="jumpType===1" class="qr-dialog">
    <el-dialog title="扫码支付" :visible.sync="dialogVisible">
      <img alt="" :src="qrcodeUrl"/>
      <div slot="footer" class="dialog-footer">
        <div class="cancle-btn" @click="dialogVisible = false">取消</div>
      </div>
    </el-dialog>
  </div>

  <div v-if="jumpType===0" class="microPayDialog">
    <el-dialog title="" :visible.sync="dialogVisible">
      <div class="microPayText">
        付款成功, 请核对顾客购买清单
        <img alt="" src="~@/assets/images/goods/microPayNotice.jpeg"/>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
  <div v-if="jumpType===4" class="microPayDialog">
    <el-dialog title="" :visible.sync="dialogVisible">
      <div class="microPayText">
        请扫描顾客微信付款码
        <img alt="" src="~@/assets/images/goods/microPayNotice.jpeg"/>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</div>
</div>
</template>

<script>
import { fetchOrder, OrderConfig, wxMicroPay, wxOrderquery } from '@/api/order'
import MobileHeader from '@/components/header/MobileHeader'
import waves from '@/directive/waves' // 水波纹指令
import payinfo from '../../../components/order/payinfo'
export default {
  name: 'payed-index',
  components: {
    payinfo,
    MobileHeader
  },
  directives: {
    waves
  },
  data() {
    return {
      jumpType: parseInt(this.$route.query.jumpType),
      orderId: parseInt(this.$route.query.oid),
      dialogVisible: false,
      microPayDialogVisible: false,
      tcount: 2,
      payedFlag: OrderConfig.payFlag.UNPAY,
      totalPrice: undefined,
      payedInfo: []             // [{name, value}]
    }
  },
  methods: {
    checkPayStatus() {
      this.timeout = setInterval(this.doCheckPay, 1000)
    },
    doCheckPay() {
      fetchOrder(this.orderId).then(response => {
        const orderInfo = response.data
        this.$store.commit('SET_MODIFYDT', orderInfo.modifyDT)
        this.payedFlag = orderInfo.payflag
        this.totalPrice = orderInfo.payFee
        switch (orderInfo.payflag) {
        case OrderConfig.payFlag.UNPAY:
          this.composeInfo(orderInfo)
          console.log(orderInfo.payflag)
          break
        case OrderConfig.payFlag.PAYED:
          this.composeInfo(orderInfo)
          this.dialogVisible = false
          clearInterval(this.timeout)
          break
        case OrderConfig.payFlag.HANG:
          this.composeInfo(orderInfo)
          clearInterval(this.timeout)
          break
        }
        // this.tcount--
        // if (this.tcount <= 0) {
        //   this.dialogVisible = false
        // this.failReturn()
        //   clearInterval(this.timeout)
        // }
      })
    },
    checkMicroPayStatus(data) {
      this.timeout = setTimeout(() => {
        wxOrderquery({ tradNo: data.tradNo }).then(response => {
          if (response.data.result_code === 'SUCCESS') {
            this.checkPayStatus()
          } else if (response.data.result_code === 'USERPAYING') {
            this.timeout = setTimeout(this.checkMicroPayStatus, response.data.interval, data)
          } else {
            this.$message.error(response.data.err_code + ':' + response.data.err_code_des)
          }
        })
      }, 1000)
    },
    failReturn() {
      this.$message.error('支付超时, 请重新支付')
      // setTimeout(() => {
      //   this.$router.go(-1)
      // }, 2000)
    },
    composeInfo(orderInfo) {
      this.payedInfo = [
        { name: '订单编号', value: orderInfo.number },
        { name: '下单时间', value: orderInfo.createDT },
        { name: '支付时间', value: orderInfo.payDT },
        { name: '支付状态', value: this.payedMsg }
      ]
    },
    confirmFinish() {
      this.$router.push({
        path: '/mobile/shop/order/list'
      })
    },
    // 发起微信扫付款码支付
    invokeWxMicroPay(code) {
      wxMicroPay({oid: this.orderId , code: code }).then(response => {
        response = response.data
        if (response.result_code === 'SUCCESS') {
          this.checkPayStatus()
        } else if (response.err_code === 'USERPAYING' ||
                   response.err_code === 'SYSTEMERROR'||
                   response.err_code === 'BANKERROR') {
          this.checkMicroPayStatus(response)
        } else {
          this.$message.error(response.data.err_code + ':' + response.data.err_code_des)
          console.log(response)
        }
      })
    }
  },
  computed: {
    qrcodeUrl() {
      return process.env.BASE_API + '/api/wxPayQrCode/' + this.orderId
    },
    payedMsg() {
      if (this.payedFlag === OrderConfig.payFlag.UNPAY) {
        return '待支付'
      }
      if (this.payedFlag === OrderConfig.payFlag.PAYED) {
        return '支付成功'
      }
      if (this.payedFlag === OrderConfig.payFlag.HANG) {
        return '挂账成功'
      }
    }
  },
  created() {
    if (this.jumpType === OrderConfig.jumpType.WECHAT_SCAN) {
      this.dialogVisible = true
      this.checkPayStatus()
    } else if (this.jumpType === OrderConfig.jumpType.WECHAT_MICROPAY) {
      this.dialogVisible = true
      this.doCheckPay()
    } else {
      this.checkPayStatus()
    }
    window['invokeWxMicroPay'] = this.invokeWxMicroPay
  },
  beforeDestroy() {
    console.log(this.timeout)
    clearInterval(this.timeout)
  }
}
</script>

<style lang="stylus">
@import "../../../common/stylus/variables";
.payed-wrapper
  margin 40px
  .payed-status
    text-align center
    color grey
  .payed-total, .payed-msg
    font-size 36px
    text-align center
  .payed-msg
    margin 20px
  .payedSuccess
    color main-red
  .icon-right_fill
    font-size 102px
  .confirm-btn
    margin-top 80px
  .cancle-btn , .confirm-btn
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
  img
    width 100%
    height auto
  .el-dialog__title, .el-dialog__headerbtn
    font-size 40px
  .el-dialog__header
    text-align center
  .microPayText
    font-size 50px
    text-align center
</style>
