<template>
    <div class="booking">
          <mobile-header :visible.sync="dialogFormVisible" header-text="餐桌预订"></mobile-header>
			<el-form   ref="dataForm" :model="temps" label-position="left" label-width="30%" style='margin:30px;' center>
			 <el-form-item label="顾客ID" required>
                 <el-input placeholder="顾客ID或者卡号" v-if="VisibleInput" v-model.number='temps.vid' @focus="hidd"></el-input>
			 	<el-autocomplete v-if="VisibleSelect" style="width:100%;"  :fetch-suggestions="querySearchAsync" placeholder="顾客ID或者卡号" @select="handleSelect"></el-autocomplete>
			 </el-form-item>
             <el-form-item label="客户姓名" >
			 	<el-input placeholder="客户姓名" v-model.number='temps.cName'  disabled></el-input>
			 </el-form-item>
			 <el-form-item label="联系电话">
			 	<el-input placeholder="联系电话" v-model.number='temps.cphone' disabled></el-input>
			 </el-form-item>
			 <el-form-item label="所属店铺">
			 	<el-select clearable v-model="temps.sid" placeholder="选择店铺" @visible-change="popupShow=!popupShow" disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
                <van-popup v-model="popupShow" :close-on-click-overlay="false">
                </van-popup>
			 </el-form-item>
     
			 <el-form-item label="预订房间" :required = "temps.bookType == 0">
                 <el-select clearable v-model="temps.bookType" placeholder="选择预订类型" @visible-change="popupShow=!popupShow">
			 		<el-option :label="roomName" value="0"></el-option>
			 		<el-option label="现在排队等待,不指定房间" value="2"></el-option>
			 		<el-option :label="roomName2" value="3"></el-option>
			 	</el-select>
			 </el-form-item>
			
            <div v-if="temps.bookType == 0">
            <el-form-item label="到店时间" :required = "temps.bookType == 0">
                <el-time-picker value-format="HH:mm"
          format="HH:mm" v-model="temps.arriveDT" :picker-options="{ selectableRange: shopTime }" placeholder="在营业时间点" >
                </el-time-picker>
			 </el-form-item>
			 <el-form-item label="前置时间" :required = "temps.bookType == 0">
			 	<el-select clearable v-model="temps.preTime" placeholder="提前显示预订时间" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in timeOtions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="保留时间" :required = "temps.bookType == 0">
			 	<el-select clearable v-model="temps.keepTime" placeholder="保留预订时间" @visible-change="popupShow=!popupShow">
			 		<el-option v-for="item in timeOtions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
            </div>
              <el-form-item label="预订人数" prop="seatNum" >
			 	<el-input placeholder="(选填)预订顾客人数" v-model.number='temps.seatNum'></el-input>
			 </el-form-item>
                  <span v-if="temps.bookType != 2" style="color:green;font-size:0.8rem">当前桌子最低起订人数为{{deskInfo['minN']}},最大容纳人数是{{deskInfo['maxN']}}</span>
			
			 <el-form-item label="推荐人" prop="auditStaf">
			 	<el-input placeholder="(选填)员工工号" v-model.number='temps.auditStaf'></el-input>
			 </el-form-item>
            <el-form-item label="备注" prop="remark">
			 	<el-input placeholder="备注" v-model='temps.remark'></el-input>
			 </el-form-item>
			</el-form>

        <el-button  style="width:80%;font-size:1rem;min-height:2.5rem;color:green;border-color:#67c23a; margin: 1rem 2rem"  @click="goHome"  v-if="!VisibleButton">返 回</el-button>
         <div v-if="VisibleButton">
            <el-button  class="sbutton" @click="goHome">返 回</el-button>
            <el-button  class="sbutton2" @click="pSubmit">确认预订</el-button>          
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
import { displayShopFilter } from '@/filters'
import { fetchCustomerList, fetchGetCustomer, deposit } from "@/api/customer";
import { getDeskInfo ,createdBookrec} from "@/api/desk";
import MobileHeader from "@/components/header/MobileHeader";
//
const temps = {
  vid: undefined,
  cName: undefined,
  cphone: undefined,
  cNo: undefined,
  roomID:undefined,
  cid: undefined,
  sid: undefined,
  bookType: "0",
  arriveDT: undefined,
  preTime: undefined,
  keepTime: undefined,
  seatNum:undefined,
  auditStaf: undefined,
  remark: undefined
};
export default {
 name: "desk-book",
  components: { MobileHeader },
  data() {
     
    return {
      dialogFormVisible: true,
      custList: [],
      shopOptions: undefined,
    //   payTypeOtions: [{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:20,name:'支付宝'},{id:3,name:'挂账'},{id:4,name:'公司招待'}],
      timeOtions: [{id:0,name:'0分钟'},{id:30,name:'30分钟'},{id:60,name:'60分钟'},{id:90,name:'90分钟'},{id:120,name:'120分钟'},{id:150,name:'150分钟'}],
      temps: temps,
      rules: {
        seatNum: [{ type: "number", message: "类型必须数数字" }],
        bookType: [{ type: "number", message: "类型必须数数字" }],
        preTime: [{ type: "number", message: "类型必须数数字" }],
        keepTime: [{ type: "number", message: "类型必须数数字" }],
        sid: [{ type: "number", message: "类型必须数数字" }],
        vid: [{ type: "number", message: "类型必须数数字" }],
      },
      chooseArray: {},
    //   options: [],
      loading: undefined,
      VisibleButton: false,
      VisibleSelect: true,
      VisibleInput: false,
      dialogVisible: false,
      paystr: undefined,
      popupShow: false,
      shopTime:{},
      roomName:'',
      roomName2:'',
      queryList: {
      },
      deskInfo:{}
    };
  },
  created() {
  
    dict("shop", 1, 0, 0).then(response => {
      // this.shopOptions = response;
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    });
    this.restInfo()
    getDeskInfo(this.$route.params.id).then(response => {
        this.deskInfo = response.data
        this.shopTime = response.data.canDT.map(item => {
            return item['start']+' - '+item['end']
        })
        this.roomName = '预订当前房间 ' + response.data.name
        this.roomName2 = '预订当前房间 ' + response.data.name + ",不指定时间"
        this.temps.roomID = response.data.id
        this.temps.sid = response.data.sid
        // console.log(this.shopTime)

    });
  },

  methods: {
    restInfo(){
        this.temps.vid = undefined
        this.temps.cid = undefined
        this.temps.cName= undefined
        this.temps.cphone = undefined
        this.temps.cNo = undefined
        this.temps.roomID=undefined
        this.temps.cid= undefined
        this.temps.sid= undefined
        this.temps.bookType= "0"
        this.temps.arriveDT= undefined
        this.temps.preTime= undefined
        this.temps.keepTime= undefined
        this.temps.seatNum=undefined
        this.temps.auditStaf= undefined
        this.temps.remark= undefined
    },
    handleSelect(item) {
      fetchGetCustomer(item.id).then(response => {
        var userInfo = response.data;
        this.temps.vid = userInfo.vid
        this.temps.cid = userInfo.id;
        this.temps.cName = userInfo.name;
        this.temps.cNo = userInfo.cNo;
        this.temps.cphone = userInfo.phone;
        this.VisibleSelect = false;
        this.VisibleInput = true;
        this.VisibleButton = true;
      });
    },
    querySearchAsync(queryString, cs) {
      if( !queryString ||queryString.length >3){
        this.queryList.selectId = queryString;
      fetchCustomerList(this.queryList).then(response => {
        // this.custList = response.data.list;
        let list = [{}];
        for (let ite of response.data.list) {
          ite.value = " ID: " + ite.vid + " 卡号: " + ite.cNo;
        }
        list = response.data.list;
        if (list.length === 0) {
          list = [{ value: "无数据" }];
        }
        cs(list);
      });
      }
    },
    hidd() {
      this.VisibleInput = false;
      this.VisibleSelect = true;
    },
    pSubmit() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
            
            if(this.temps.bookType != 0){
                this.temps.bookType = 2
                this.temps.roomID = undefined
            }
          createdBookrec(this.temps).then(response => {
            const data = response.data;
            // if(listQuery.payType !=0 && listQuery.payType !=20 ){
              if( response.code === 200){
                this.goHome()
              }
              this.$notify({
                title:'预订记录创建',
                message:response.msg,
                type: response.code === 200?'success' : 'danger',
                duration: 2000
              })
            // }
          });
    //     }
    //   });
    },
    handleClose(){
      this.dialogVisible = false
      this.paystr = this.displayNameFilter(this.temps.payType, this.payTypeOtions)
    },
     goHome(){
      this.$router.push({ path: '/mobile/desk/index'})
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
    width:48%
    font-size:1rem
    min-height:2.5rem
    color :green
    border-color:#67c23a
  }
  .sbutton2{
    width:48%
    font-size:1rem
    min-height:2.5rem
    color :red
    border-color:red
  }
  .booking{
      .el-input.is-disabled {
          .el-input__inner{
          color:#333
      }
      }
          
      
  }
</style>


