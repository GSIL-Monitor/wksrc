<template>
    <div class="member">
          <mobile-header :visible.sync="dialogFormVisible" header-text="顾客ID合并"></mobile-header>
			<el-form   :model="temps" label-position="left" label-width="35%" style='margin:30px 30px 10px 30px;'>
			 <el-form-item label="顾客ID">
                 <el-input placeholder="顾客ID或者卡号" v-if="VisibleInput" v-model.number='temps.vid' @focus="hidd"></el-input>
			 	<el-autocomplete v-if="VisibleSelect" style="width:100%;"  :fetch-suggestions="querySearchAsync" placeholder="顾客ID或者卡号" @select="handleSelect"></el-autocomplete>
			 </el-form-item>
        <el-form-item label="客户姓名" >
			 	<!-- <span>{{temps.name}}</span> -->
         <el-input class="disabledColor" v-model="temps.name" disabled></el-input>
			 </el-form-item>
        <!-- <el-form-item label="用户店铺" >
         <el-select clearable v-model="temps.sid" placeholder="选择店铺" @visible-change="popupShow=!popupShow" disabled >
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
           <van-popup v-model="popupShow" :close-on-click-overlay="false"></van-popup>
			 </el-form-item> -->
			 <el-form-item label="联系电话">
                 <!-- <span>{{temps.phone}}</span> -->
            <el-input v-model="temps.phone" disabled></el-input>
			 </el-form-item>
             <span v-if="!VisibleButton" style="color: #F56C6C">提示：当前账号是 <em style="color:#409EFF">会员或者不是微信账号</em>,无法合并</span>
      <!-- <el-form-item label="用户等级">
            <el-select clearable v-model="temps.level" placeholder="用户等级" @visible-change="popupShow=!popupShow" disabled>
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
			 </el-form-item> -->
            <!-- <el-form-item label="当前账户余额" >
                <el-input v-model="temps.leftFund" disabled style="color:#F56C6C;"></el-input>
            </el-form-item>   -->
			</el-form>
            <div >
        <el-form    :model="target" label-position="left" label-width="35%" style='margin:10px 30px;'>
			 <el-form-item label="合并的目标ID" >
                <el-input placeholder="合并之后ID或者卡号" v-if="VisibleInput2" v-model.number='target.vid' @focus="hidd2"></el-input>
			 	<el-autocomplete v-if="VisibleSelect2" style="width:100%;"  :fetch-suggestions="querySearchAsync2" placeholder="合并之后ID或者卡号" @select="handleSelect2" :disabled="!VisibleButton"></el-autocomplete>
			 </el-form-item>
          <el-form-item label="目标姓名" >
         <el-input v-model="target.name" disabled></el-input>
			 	<!-- <span>{{target.name}}</span> -->
			 </el-form-item>
        <!-- <el-form-item label="目标店铺" >
         <el-select clearable v-model="target.sid" placeholder="选择店铺" @visible-change="popupShow=!popupShow" disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item> -->
			 <el-form-item label="目标电话" >
                 <!-- <span>{{target.phone}}</span> -->
            <el-input v-model="target.phone" disabled></el-input>
			 </el-form-item>
			 <!-- <el-form-item label="目标等级">
            <el-select clearable v-model="target.level" placeholder="用户等级" @visible-change="popupShow=!popupShow" disabled>
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
			 </el-form-item> -->
        <!-- <el-form-item label="目标账户余额">
            <el-input v-model="target.leftFund" disabled style="color:#F56C6C;"></el-input>
        </el-form-item> -->
			</el-form>
            </div>

        <!-- <el-button  style="width:80%;font-size:1rem;min-height:2.5rem;color:green;border-color:#67c23a; margin: 1rem 2rem"  @click="goHome"  v-if="!VisibleButton">返 回</el-button> -->
         <div>
            <el-button  class="sbutton" @click="goHome">返 回</el-button>
            <el-button  class="sbutton2"  @click="mergeCustomerID">确认合并</el-button>          
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
import { fetchCustomerList, fetchGetCustomer ,mergeCustomerID} from "@/api/customer";
import MobileHeader from "@/components/header/MobileHeader";
//
const temps = {
  vid: undefined,
  name: undefined,
  phone: undefined,
  cid: undefined,
  sid: undefined,
  level: undefined,
  leftFund: undefined,
};
const target = {
  vid: undefined,
  name: undefined,
  phone: undefined,
  cid: undefined,
  sid: undefined,
  level: undefined,
  leftFund: undefined,
};
export default {
  name: "mrege-id",
  components: { MobileHeader },
  data() {
    return {
      dialogFormVisible: true,
      custList: [],
      shopOptions: undefined,
      levelOptions: undefined,
      leftFund: undefined,
      queryList: {
        // level: 9999
      },
      temps: temps,
      target: target,

      chooseArray: {},
      options: [],
      loading: undefined,
      VisibleButton: true,
      VisibleSelect: true,
      VisibleInput: false,
      VisibleSelect2: true,
      VisibleInput2: false,

      paystr: undefined,
      popupShow: false
    };
  },
  created() {
    dict("cLevel").then(response => {
      this.levelOptions = response;
    });
    dict("shop", 1, 0, 0).then(response => {
      // this.shopOptions = response;
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    });
    fetchCustomerList(this.queryList).then(response => {
      this.custList = response.data.list;
      this.shopOptions = response.data.shopList;
    });
  },

  methods: {
    handleSelect(item) {
      fetchGetCustomer(item.id).then(response => {
        this.temps = response.data;
        // this.temps.vid = response.data.vid
        this.temps.cid = this.temps.id;
        this.VisibleSelect = false;
        this.VisibleInput = true;
        if(this.temps.level >0 || this.temps.leftFund >0){
            this.VisibleButton = false;
        }else{
            this.VisibleButton = true;
        }
      });
    },
    querySearchAsync(queryString, cs) {
    if(queryString === undefined || queryString.length < 4){
        let list = [{ value: "输入4位以上数字" }];
        cs(list);
        return
      }
      // console.log(queryString)
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
          list = [{ value: "查找不到顾客信息" }];
        }
        cs(list);
      });
      }
    },
    handleSelect2(item) {
      fetchGetCustomer(item.id).then(response => {
        this.target = response.data;
        this.target.cid = this.target.id;
        this.VisibleSelect2 = false;
        this.VisibleInput2 = true;

      });
    },
    querySearchAsync2(queryString, cs) {

     if(queryString === undefined || queryString.length < 4){
        let list = [{ value: "输入4位以上数字" }];
        cs(list);
        return
      }
      // console.log(queryString)
      if( queryString.length >3){
        this.queryList.selectId = queryString;
        this.queryList.level = undefined;
      fetchCustomerList(this.queryList).then(response => {
        // this.custList = response.data.list;
        let list = [{}];
        for (let ite of response.data.list) {
          ite.value = "ID:" + ite.vid + "卡:" + ite.cNo;
        }
        list = response.data.list;
        if (list.length === 0) {
          list = [{ value: "查找不到顾客信息" }];
        }
        cs(list);
      });
      }
   
    },
    hidd() {
      this.VisibleInput = false;
      this.VisibleSelect = true;
    },
    hidd2() {
      this.VisibleInput2 = false;
      this.VisibleSelect2 = true;
    },
    mergeCustomerID() {  
        mergeCustomerID(this.temps.id,{vid:this.target.vid}).then(response => {
        const data = response.data;
            if( response.code === 200){
            this.goHome()
            }
            this.$notify({
            title:'顾客ID合并',
            message:response.msg,
            type: response.code === 200?'success' : 'danger',
            duration: 2000
            })
        });
        // }
    //   });
    },

     goHome(){
      this.$router.push({ path: '/mobile/dashboard'})
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
<style scoped>
.el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  
</style>


