<template>
    <div class="member">
          <mobile-header :visible.sync="dialogFormVisible" header-text="会员充值"></mobile-header>
			<el-form  :rules="rules" ref="dataForm" :model="temps" label-position="left" label-width="45%" style='margin:30px;'>
			 <el-form-item label="顾客ID" prop="id" >
                 <el-input placeholder="顾客ID或者卡号" v-if="VisibleInput" v-model.number='temps.vid' @focus="hidd"></el-input>
			 	<el-autocomplete v-if="VisibleSelect" style="width:100%;"  :fetch-suggestions="querySearchAsync" placeholder="顾客ID或者卡号" @select="handleSelect"></el-autocomplete>
			 </el-form-item>
             <el-form-item label="客户姓名" prop="name">
			 	<el-input placeholder="客户姓名" v-model.number='temps.name' ></el-input>
			 </el-form-item>
			 <el-form-item label="联系电话" prop="phone">
			 	<el-input placeholder="联系电话" v-model.number='temps.phone' ></el-input>
			 </el-form-item>
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="temps.sid" placeholder="选择店铺" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
        <van-popup v-model="popupShow" :close-on-click-overlay="false">
        </van-popup>
			 </el-form-item>
        <el-form-item label="当前余额" v-if="VisibleButton"><span style="color:#F56C6C;">{{leftFund}}</span></el-form-item>     
			 <el-form-item label="支付方式" prop="payType">
			 	<el-select clearable v-model="temps.payType" placeholder="选择支付方式" @visible-change="popupShow=!popupShow">
          <!-- <el-option label="微信支付" value=0></el-option> -->
			 		<el-option v-for="item in payTypeOtions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>

     
			 <el-form-item label="充值金额" prop="fee">
			 	<el-input placeholder="输入充值金额" v-model.number='temps.fee'></el-input>
			 </el-form-item>

      <el-form-item label="是否开票">
			 	<el-select  v-model="gift"  @visible-change="popupShow=!popupShow">
			 		<el-option label="不需要发票" value="0"></el-option>
			 		<el-option label="需要发票" value="1"></el-option>
			 	</el-select> 
			 </el-form-item>

			 <el-form-item label="赠送金额(发票)" prop="giftFund2" v-if="gift == 1">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='temps.giftFund2'></el-input>
			 </el-form-item>
			 <el-form-item label="赠送金额" prop="giftFund" v-if="gift == 0">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='temps.giftFund'></el-input>
			 </el-form-item>
			 <el-form-item label="业绩员工" prop="staffID">
			 	<el-input placeholder="(选填)员工工号" v-model.number='temps.staffID'></el-input>
			 </el-form-item>
			</el-form>

        <el-button  style="width:80%;font-size:1rem;min-height:2.5rem;color:green;border-color:#67c23a; margin: 1rem 2rem"  @click="goHome"  v-if="!VisibleButton">返 回</el-button>
         <div v-if="VisibleButton">
            <el-button  class="sbutton" @click="goHome">返 回</el-button>
            <el-button  class="sbutton2"  v-if="temps.payType != 0 && temps.payType != 20 " @click="paySubmit">确认充值</el-button>          
            <el-button  class="sbutton2"  v-if="temps.payType == 0 || temps.payType == 20" @click="paySubmit">扫码支付充值</el-button>
         </div>
         <!-- <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
             <div  v-for="item in payTypeOtions" style="margin-top: 10px">
               <el-radio v-model="temps.payType" :label="item.id"  @change="handleClose"><span style="font-size:1rem;">{{ item.name }}</span></el-radio>
             </div>
          </el-dialog> -->
    </div>
   
    
</template>
<script>
import { dict } from "@/store";
import { fetchCustomerList, fetchGetCustomer, deposit } from "@/api/customer";
import MobileHeader from "@/components/header/MobileHeader";
import { displayShopFilter } from '@/filters'
//
const temps = {
  vid: undefined,
  name: undefined,
  phone: undefined,

  cid: undefined,
  sid: undefined,
  payType: undefined,
  fee: undefined,
  giftFund: undefined,
  giftFund2: undefined,
  // openLevel:undefined,
  staffID: undefined,
  giftFundSrv: undefined
};
export default {
  name: "member-topup",
  components: { MobileHeader },
  data() {
    var checkFee = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("充值金额不能为空"));
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        // 	callback(new Error('请输入整数金额'));
        // }else{
        callback();
        // }
      }, 1000);
    };
    var isMobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    var checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号码不能为空'));
        } else {
          if (!(isMobile.test(value))) {
            callback(new Error('手机号码格式有误(11位)'));
          }
          callback();
        }
      };
    return {
      dialogFormVisible: true,
      custList: [],
      shopOptions: undefined,
      payTypeOtions: [{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:20,name:'支付宝'},{id:3,name:'挂账'},{id:4,name:'公司招待'}],
      levelOptions: undefined,
      leftFund: undefined,
      queryList: {
        level: 9999
      },
      temps: temps,
      rules: {
        fee: [{ required: true }, { validator: checkFee }],
        giftFund: [{ type: "number", message: "类型必须数数字" }],
        giftFund2: [{ type: "number", message: "类型必须数数字" }],
        giftFundSrv: [{ type: "number", message: "类型必须数数字" }],
        payType: [{ required: true, message: "支付类型必须选择" }],
        sid: [{ required: true }],
        // vid:[{required:true}],
        // openLevel:[{required:true}],
        name: [{ required: true }],
        phone: [{ validator: checkPhone}]
      },
      chooseArray: {},
      options: [],
      loading: undefined,
      VisibleButton: false,
      VisibleSelect: true,
      VisibleInput: false,
      dialogVisible: false,
      paystr: undefined,
      popupShow: false,
      gift:"0"
    };
  },
  created() {
    dict("cLevel").then(response => {
      this.levelOptions = response;
    });
    dict("shop", 1, 0, 0).then(response => {
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    });
    // fetchCustomerList(this.queryList).then(response => {
    //   this.custList = response.data.list;
    //   this.shopOptions = response.data.shopList;
    // });
  },

  methods: {
    handleSelect(item) {
      fetchGetCustomer(item.id).then(response => {
        this.temps = response.data;
        // this.temps.vid = response.data.vid
        this.temps.cid = this.temps.id;
        this.leftFund = this.temps.leftFund;
        this.VisibleSelect = false;
        this.VisibleInput = true;
        this.VisibleButton = true;
      });
    },
    querySearchAsync(queryString, cs) {
      if(queryString === undefined || queryString.length < 4){
        let list = [{ value: "输入4位以上数字" }];
        cs(list);
        return
      }
      console.log(queryString)
      if( queryString.length >3){
        this.queryList.selectId = queryString;
      fetchCustomerList(this.queryList).then(response => {
        // this.custList = response.data.list;
        let list = [{}];
        for (let ite of response.data.list) {
          ite.value = "ID:" + ite.vid + "卡:" + ite.cNo;
        }
        list = response.data.list;
        if (list.length === 0) {
          list = [{ value: "无数据或者未开通" }];
        }
        cs(list);
      });
      }
    },
    hidd() {
      this.VisibleInput = false;
      this.VisibleSelect = true;
    },
    paySubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var tem = this.temps;
          const listQuery = {};
          listQuery.cid = tem.cid;
          listQuery.sid = tem.sid;
          listQuery.name = tem.name;
          listQuery.phone = tem.phone;
          listQuery.staffID = tem.staffID;
          listQuery.payType = tem.payType;
          listQuery.fee = tem.fee;
          listQuery.giftFund = tem.giftFund;
          listQuery.giftFund2 = tem.giftFund2;
          listQuery.giftFundSrv = tem.giftFundSrv;
          deposit(listQuery).then(response => {
            const data = response.data;
            if(listQuery.payType !=0 && listQuery.payType !=20 ){
              if( response.code === 200){
                this.goHome()
              }
              this.$notify({
                title:'会员',
                message:response.msg,
                type: response.code === 200?'success' : 'danger',
                duration: 2000
              })
            }
            if (data.jumpType === 1) {
              // data.paymentParam.success = (res) => {
              this.$router.push({
                path: "/mobile/member/pay",
                query: { jumpType: data.jumpType, oid: data.payID }
              });
              // }
            }
          });
        }
      });
    },
    handleClose(){
      this.dialogVisible = false
      this.paystr = this.displayNameFilter(this.temps.payType, this.payTypeOtions)
    },
     goHome(){
      this.$router.push({ path: '/mobile/dashboard'})
    },
     handleOpen(){
      this.dialogVisible = true
      // this.payTypeOtions.push({id:0,name:'微信支付'})
    },
    displayNameFilter(sid, options) {
      		const finded = options.find((option) => option.id === sid)
      		if (finded) {
        		return finded.name
      			} else {
        			console.log(sid)
      			}
    			},
  }
};
</script>
<style lang="stylus" scoped>

  .submit-button{
           height 80px
           line-height 80px
           font-size 36px
           font-weight 500
           width 100%
           text-align center
           border 0.03125rem solid #ececec
           border-radius 15px
           color #fff
           background-color #F56C6C
  }
  .sbutton{
    width:40%
    font-size:1rem
    min-height:2.5rem
    color :green
    border-color:#67c23a
    margin-left :2rem
  }
  .sbutton2{
    width:40%
    font-size:1rem
    min-height:2.5rem
    color :red
    border-color:red
    margin-right :2rem
  }
</style>


