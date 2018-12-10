<template>
    <div class="member">
          <mobile-header :visible.sync="dialogFormVisible" header-text="开通会员"></mobile-header>
			<el-form  :rules="rules" ref="dataForm" :model="temps" label-position="left" label-width="45%" style='margin:30px;'>
			 <el-form-item label="顾客ID" prop="vid" >
         <el-input placeholder="顾客ID或者卡号" v-if="VisibleInput" v-model.number='temps.vid' @focus="hidd"></el-input>
			 	<el-autocomplete v-if="VisibleSelect"style="width:100%;"  :fetch-suggestions="querySearchAsync" placeholder="顾客ID或者卡号" @select="handleSelect"></el-autocomplete>
			 </el-form-item>
             <el-form-item label="客户姓名" prop="name">
			 	<el-input placeholder="客户姓名" v-model='temps.name' ></el-input>
			 </el-form-item>
			 <el-form-item label="联系电话" prop="phone">
			 	<el-input placeholder="联系电话" v-model='temps.phone' ></el-input>
			 </el-form-item>
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="temps.sid" placeholder="选择店铺" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
          <van-popup v-model="popupShow" :close-on-click-overlay="false">
        </van-popup>
			 </el-form-item>
        <el-form-item label="支付方式" prop="payType">
			 	<el-select clearable v-model="temps.payType" placeholder="选择支付方式" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in payTypeOtions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>

			 </el-form-item>
			 <el-form-item label="会员等级" prop="openLevel">
			 	<el-select  v-model="temps.openLevel" placeholder="选择开通的等级" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select> 
			 </el-form-item>
             
			 <el-form-item label="开通金额" prop="fee">
			 	<el-input placeholder="输入开通金额" v-model.number='temps.fee'></el-input>
                 <!-- <em style="color:#F56C6C">金额整十</em> -->
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
             <!-- <el-form-item> -->
            <el-button  style="width:80%;font-size:1rem;min-height:2.5rem;color:green;border-color:#67c23a; margin: 1rem 2rem"  @click="goHome"  v-if="!VisibleButton">返 回</el-button>
            <div  v-if="VisibleButton">
            <el-button  class="sbutton" @click="goHome">返 回</el-button>
            <el-button  class="sbutton2"  v-if="temps.payType != 0 && temps.payType != 20 " @click="paySubmit">确认开通</el-button>          
            <el-button  class="sbutton2"  v-if="temps.payType == 0 || temps.payType == 20" @click="paySubmit">扫码支付充值</el-button>
                </div>
             <!-- </el-form-item> -->
            </el-form>
    </div>
</template>
<script>
import { dict } from "@/store";
import { fetchCustomerList, fetchGetCustomer, deposit } from "@/api/customer";
import MobileHeader from "@/components/header/MobileHeader";
import { displayShopFilter } from '@/filters'
// import DialogSelect from "@/components/dialog/dselect";
//
export default {
  name: "member-open",
  components: { MobileHeader  },
  data() {
    var checkFee = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("充值金额不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入整数金额"));
        } else {
            callback();
        }
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
      payTypeOtions:  [{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:20,name:'支付宝'},{id:3,name:'挂账'},{id:4,name:'公司招待'}],
      levelOptions: undefined,
      queryList: {
        level: 0
      },
      gift:"0",
      temps: {
        vid: undefined,
        name: undefined,
        phone: undefined,

        cid: undefined,
        sid: undefined,
        payType: undefined,
        fee: undefined,
        giftFund: undefined,
        giftFund2: undefined,
        openLevel: undefined,
        staffID: undefined,
        giftFundSrv: undefined
      },
      rules: {
        fee: [{ required: true }, { validator: checkFee }],
        giftFund: [{ type: "number", message: "类型必须数数字" }],
        giftFund2: [{ type: "number", message: "类型必须数数字" }],
        giftFundSrv: [{ type: "number", message: "类型必须数数字" }],
        payType: [{ required: true, message: "支付类型必须选择" }],
        sid: [{ required: true }],
        // vid: [{ required: true }],
        openLevel: [{ required: true }],
        name: [{ required: true }],
        phone: [{ validator: checkPhone}]
        
      },
      chooseArray: {},
      options: [],
      loading: undefined,
      VisibleButton: false,
      VisibleSelect:true,
      VisibleInput:false,
      ts:[],
      paystr:undefined,
      dialogVisible:false,
      popupShow:false
    };
  },
  created() {
    dict("cLevel").then(response => {
      this.levelOptions = response;
    });
    // dict("payType",0,0,0).then(response => {
    //   this.payTypeOtions = response;
    // });
    
    fetchCustomerList(this.queryList).then(response => {
      this.custList = response.data.list;
      // this.shopOptions = response.data.shopList;
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)
    });
  },

  methods: {
    querySearchAsync(queryString,cs){

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
          list = [{ value: "无数据或已开通" }];
        }
        cs(list);
      });
      }
    },
    handleSelect(item){
       fetchGetCustomer(item.id).then(response => {
        this.temps = response.data;
        // this.temps.vid = response.data.vid
        this.temps.cid = this.temps.id;
        this.VisibleSelect = false;
        this.VisibleButton=true;
        this.VisibleInput = true;
      });
    },
    hidd(){
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
          listQuery.openLevel = tem.openLevel;
          listQuery.payType = tem.payType;
          listQuery.fee = tem.fee;
          listQuery.giftFund = tem.giftFund;
          listQuery.giftFund2 = tem.giftFund2;
          listQuery.giftFundSrv = tem.giftFundSrv;
          deposit(listQuery).then(response => {
            const data = response.data
             if(listQuery.payType !=0 && listQuery.payType !=20){
              
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
                path: '/mobile/member/pay',
                query: { jumpType: data.jumpType, oid: data.payID }
                    })
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
    width:38%
    font-size:1rem
    min-height:2.5rem
    color :green
    border-color:#67c23a
    margin-left :2rem
  }
  .sbutton2{
    width:38%
    font-size:1rem
    min-height:2.5rem
    color :red
    border-color:red
    margin-right :2rem
  }
</style>
