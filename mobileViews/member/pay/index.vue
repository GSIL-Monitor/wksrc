<template>
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
  <div class="qr-dialog">
    <el-dialog title="扫码支付" :visible.sync="dialogVisible">
      <img alt="" :src="qrcodeUrl"/>
      <div slot="footer" class="dialog-footer">
        <div class="cancle-btn" @click="dialogVisible = false">取消</div>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {  OrderConfig } from '@/api/order'
import { fetchPayInfo} from '@/api/customer'
import waves from '@/directive/waves' // 水波纹指令
import payinfo from './payinfo'
export default {
  name: 'payed-index',
  components: {
    payinfo
  },
  directives: {
    waves
  },
  data() {
    return {
      jumpType: parseInt(this.$route.query.jumpType),
      payId: parseInt(this.$route.query.oid),
      // payId: parseInt(this.$route.query.oid),
      dialogVisible: false,
      tcount: 100,
      payedFlag: OrderConfig.payFlag.UNPAY,
      totalPrice: undefined,
      payedInfo: []             // [{name, value}]
    }
  },
  methods: {
      checkPayStatus() {
      this.timeout = setInterval(() => {
        fetchPayInfo(this.payId).then(response => {
          const payInfo = response.data
          this.payedFlag = payInfo.status
          this.totalPrice = payInfo.sumFund
          switch (payInfo.status) {
          case 0:
            this.composeInfo(payInfo)
            console.log(payInfo.payflag)
            break
          case 1:
            this.composeInfo(payInfo)
            this.dialogVisible = false
            clearInterval(this.timeout)
            break
          case 2:
            this.composeInfo(payInfo)
            clearInterval(this.timeout)
            break
          }
          this.tcount--
          if (this.tcount <= 0) {
            this.dialogVisible = false
            this.failReturn()
            clearInterval(this.timeout)
          }
        })
      }, 3000)
    },
    failReturn() {
      this.$message.error('支付超时, 请重新支付')
      // setTimeout(() => {
      //   this.$router.go(-1)
      // }, 2000)
    },
    composeInfo(orderInfo) {
      this.payedInfo = [
        { name: '订单编号', value: orderInfo.tradNo },
        { name: '下单时间', value: orderInfo.createDT},
        { name: '支付时间', value: orderInfo.payDT },
        { name: '支付状态', value: this.payedMsg }
      ]
    },
    confirmFinish() {
      this.$router.push({
        path: '/mobile/dashboard'
      })
    }
  },
  computed: {
    qrcodeUrl() {
      return process.env.BASE_API + '/api/wxPayQrCode/' + this.payId
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
    this.dialogVisible = this.jumpType === 1
    this.checkPayStatus()
  },
  beforeDestroy() {
    console.log(this.timeout)
    clearInterval(this.timeout)
  }
}
</script>

<style lang="stylus">
@import "../common/stylus/variables";
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
</style>
