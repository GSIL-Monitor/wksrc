<template>
  <div class="app-container">
   <div v-if="uploadShow">
     <div style="display:inline-block ; "><upload-excel-component @success='handleSuccess'></upload-excel-component></div> 
   <el-button  style="display:inline-block ; " type="danger" @click="goToLoadTpl" >下载批量充值模板</el-button>
   </div>
   <!-- <div v-if="!uploadShow" class="filter-container"> 
     <el-button type="danger" @click="goToLoadTpl" >下载批量充值模板</el-button>
     <el-select clearable  style="width: 130px" v-model="postData.LFType" placeholder="顾客类型">
				<el-option label="外部会员" value="0"></el-option>
				<el-option label="内部员工" value="1"></el-option>
			</el-select>
     <el-select clearable  style="width: 130px" v-model="postData.print" placeholder="是否需要打印">
				<el-option label="不打印" value="0"></el-option>
				<el-option label="打印" value="1"></el-option>
			</el-select>
     <el-select clearable  style="width: 130px" v-model="postData.invoice" placeholder="是否保存发票信息">
				<el-option label="不要发票" value="0"></el-option>
				<el-option label="需要发票" value="1"></el-option>
			</el-select>
			<el-select clearable  style="width: 130px" v-model="postData.payType" placeholder="支付方式">
				<el-option v-for="item in payOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>

      <el-button type="success"  @click='restStatus' icon="el-icon-edit">重新导入数据</el-button>
      <span v-if="!loadingDeposit">
      <el-button type="danger" v-if="!theEnd" @click="deposit"  :disabled="canTopup || wanging" :loading="btnProtect"><span v-if="btnProtect">正在</span>批量充值</el-button>
      <span class="bg-1" v-if="canTopup && !wanging">数据有异常无法进行批量充值，请修改表格后重新导入</span>
      <span class="bg-2" v-if="!canTopup && wanging">有警告无法进行批量充值,请确认警告</span>
      </span>  
   </div> -->

   <div v-if="!uploadShow" class="filter-container"> 
      <el-form :inline="true"  :rules="rules"  :model="postData" class="demo-form-inline" ref="postData">
        <el-form-item>
         <el-button type="danger" @click="goToLoadTpl" >下载批量充值模板</el-button>
        </el-form-item>
        <el-form-item label="顾客类型"  prop="LFType" >
          <el-select clearable  style="width: 130px" v-model="postData.LFType" placeholder="顾客类型">
            <el-option label="外部会员" value="0"></el-option>
            <el-option label="内部员工" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印" prop="print">
             <el-select clearable  style="width: 130px" v-model="postData.print" placeholder="是否需要打印">
              <el-option label="不打印" value="0"></el-option>
              <el-option label="打印" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发票" prop="invoice">
             <el-select clearable  style="width: 130px" v-model="postData.invoice" placeholder="是否保存发票信息">
                <el-option label="不要发票" value="0"></el-option>
                <el-option label="需要发票" value="1"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
             <el-select clearable  style="width: 130px" v-model="postData.payType" placeholder="支付方式">
              <el-option v-for="item in payOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
           <el-button type="success"  @click='restStatus' icon="el-icon-edit">重新导入数据</el-button>
        </el-form-item>
        <span v-if="!loadingDeposit">
      <el-button type="danger" v-if="!theEnd" @click="deposit('postData')"  :disabled="canTopup || wanging" :loading="btnProtect"><span v-if="btnProtect">正在</span>批量充值</el-button>
      <span class="bg-1" v-if="canTopup && !wanging">数据有异常无法进行批量充值，请修改表格后重新导入</span>
      <span class="bg-2" v-if="!canTopup && wanging">有警告无法进行批量充值,请确认警告</span>
      </span>
      </el-form>  
   </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <!-- <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column> -->
	  <el-table-column align="center" label="序号" width='70'>
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="顾客编号">
				<template slot-scope="scope">
					<span>{{scope.row.vid}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="会员卡卡号" >
				<template slot-scope="scope">
					<span>{{scope.row.cNo}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="名称" >
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="电话" >
				<template slot-scope="scope">
					<span>{{scope.row.phone}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="充值金额" >
				<template slot-scope="scope">
					<span>{{scope.row.fee}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="赠送金额" >
				<template slot-scope="scope">
					<span>{{scope.row.giftFund}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="类型" >
				<template slot-scope="scope">
					<span>{{postData.LFType == 1 ? '内部员工':'外部会员'}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="备注" >
				<template slot-scope="scope">
					<span :class="scope.row.status | bgColorFilter">{{scope.row.remark}}</span>
				</template>
	  </el-table-column>
	  <el-table-column align="center" label="状态" >
				<template slot-scope="scope">
					<span v-if="scope.row.status != 2" :class="scope.row.status | bgColorFilter">{{scope.row.status == 1 ?'异常' : (scope.row.status == 0 ?'未充值' :'已充值')}}</span>
          <el-button v-if="scope.row.status == 2" type="success" @click='handleUpdate(scope.row)' icon="el-icon-edit">确认警告</el-button>
				</template>
	  </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from './components/batchUploadExcel.vue'
import { CheckCust ,BatchDeposit} from '@/api/customer'
import { dict} from '@/store'

export default {
  name: 'batch-topup',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      postData:{
        custData:this.tableData,
        payType:undefined,
        LFType:undefined,
        invoice:undefined,
        print:undefined,
      },
      uploadShow:true,
      canTopup:false,
      loadingDeposit:false,
      theEnd:false,
      wanging:false,
      btnProtect:false,

       rules: {
          LFType: [
            { required: true, message: '请选择顾客类型', trigger: 'change' },
          ],
          print: [
            { required: true, message: '请选择是否打印', trigger: 'change' }
          ],
          invoice: [
            { required: true, message: '请选择是否需要发票', trigger: 'change' }
          ],
          payType: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ],
        }
    
      // payOptions:[{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:20,name:'支付宝'},{id:3,name:'挂账'},{id:4,name:'公司招待'}],
    }
  },
  created(){
    dict('payType',0,0,0).then(response=>{
				this.payOptions = response
			})
  },
  methods: {
    handleSuccess({ results, header }) {
      console.log(results)
      this.theEnd=false,
      CheckCust({custData:results}).then(response => {
          this.uploadShow =false
          this.tableData = response.data
          this.tableData.map(item => {
            if(item.status == 1){
              this.canTopup = true
            }
            if(item.status == 2 ){
              this.wanging = true
            }
          })
          if(this.canTopup){
            this.wanging =false
          }
      })
    },
    deposit(postData) {
      this.$refs[postData].validate((valid) => {
      if (valid) {
        
      
      this.btnProtect = true
      var ptype = this.payOptions.find((item)=>item.id == this.postData.payType)
      // var tishi = '本次批量充值设置：顾客类型：'+(this.postData.LFType==0?'外部会员;':'内部员工;')+'是否打印：' +(this.postData.print==0?'不打印;':'打印;') + '是否要发票：' +(this.postData.invoice==0?'不要发票;':'要发票;')+'支付方式：' + ptype.name
      // console.log(ptype) 
      const h = this.$createElement;
      this.$msgbox({
        title:'批量充值提示',
        message:h('p',{ style: 'font-size: 0.8rem' },[
          h('p',null,'本次批量充值设置：'),
          h('p',null,'顾客类型：'+(this.postData.LFType==0?'外部会员;':'内部员工;')),
          h('p',null,'是否打印：'+(this.postData.print==0?'不打印;':'打印;')),
          h('p',null,'有关发票：'+(this.postData.invoice==0?'不要发票;':'要发票;')), 
          h('p',null,'支付方式：'+ ptype.name),
        ]), 
          showCancelButton: true,
          confirmButtonText: ' 确  定 ',
          cancelButtonText: ' 取  消 ',
          cancelButtonClass:'MessageCancel',
          confirmButtonClass:'MessageConfirm',
          type: 'danger',
          // center: true
        }).then(() => { 
          this.postData.custData = this.tableData
          BatchDeposit(this.postData).then(response => {
              this.tableData = response.data
              this.btnProtect = false
              this.theEnd=true
              this.loadingDeposit = false
          })
        }).catch(() => {
           this.btnProtect = false
        });
      // this.postData.custData = this.tableData
      // BatchDeposit(this.postData).then(response => {
      //     this.tableData = response.data
      //     this.theEnd=true
      //      this.loadingDeposit = false
      // })
      }})
    },
    restStatus(){
     this.uploadShow = true
     this.canTopup = false
     this.loadingDeposit = false
    },
    handleUpdate(row){
       this.$confirm(row.remark, '警告', {
          confirmButtonText: ' 确  定 ',
          cancelButtonText: ' 取  消 ',
          cancelButtonClass:'MessageCancel',
          confirmButtonClass:'MessageConfirm',
          type: 'warning',
          center: true
        }).then(() => { 
          this.wanging = false
          const index = this.tableData.indexOf(row)
          this.tableData[index]['status']=0
          this.tableData.map(item => {
                if(item.status == 2){
                  this.wanging = true
                }
              })
        }).catch(() => {
        });
    },
    goToLoadTpl(){
      this.$router.push({path:'/customer/loadBatchTpl'})
    }
  },
  filters:{
    bgColorFilter(Status) {
      if(Status == 1){
        return 'bg-' + 1
      }else if(Status == 0){
        return 'bg-' + 0
      }else{
        return 'bg-' + 2
      }
    },
    // textFilter(Status) {
    //   if(Status == 1){
    //     return ''
    //   }else if(Status == 0){
    //     return 'bg-' + 0
    //   }else{
    //     return 'bg-' + 2
    //   }
    // },
  }
}
</script>
<style >
.MessageCancel  {
    background:#fff;
    width:42%;
    font-size:1rem;
    min-height:1.5rem;
    color :green;
    border-color:#67c23a;
}
.MessageConfirm {
    background:#fff;
    width:42%;
    font-size:1rem;
    min-height:1.5rem;
    color :red;
    border-color:red;
    margin-right: 1rem;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.bg-0 {
    color: green;
}
.bg-1 {
    color: red;
}
.bg-2 {
    color:chocolate;
}
</style>


