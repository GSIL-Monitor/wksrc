
<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 140px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<!-- <el-input @keyup.enter.native="handleFilter" style="width: 80px;"  placeholder="客户ID" v-model="listQuery.cid"></el-input> -->
			<!-- <el-select clearable  style="width: 120px" v-model="listQuery.opType" placeholder="统计方式">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select> -->
    		<el-date-picker  v-model="listQuery.createDT" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"> </el-date-picker>

			<el-button  type="success"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
			<el-button  type="danger"  icon="el-icon-search" @click="handleCashier"> 开始交班 </el-button>

		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="交班账号">
				<template slot-scope="scope">
					<span>{{scope.row.opStaf}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="开始时间" min-width="130">
				<template slot-scope="scope">
					<span>{{scope.row.fromDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="结束时间" min-width="130">
				<template slot-scope="scope">
					<span>{{scope.row.toDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" min-width="110">
				<template slot-scope="scope">
					<span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="订单支付">
				<template slot-scope="scope">
					<span>{{scope.row.payFee}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="会员开通">
				<template slot-scope="scope">
					<span>{{scope.row.sumBeVip}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="会员充值">
				<template slot-scope="scope">
					<span>{{scope.row.sumCharge}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="挂账总额">
				<template slot-scope="scope">
					<span>{{scope.row.unpayFee}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="退款总额">
				<template slot-scope="scope">
					<span>{{scope.row.refund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="抹零总额">
				<template slot-scope="scope">
					<span>{{scope.row.byDiscount}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="备注">
				<template slot-scope="scope">
					<span>{{scope.row.remark}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="250">
				<template slot-scope="scope">
                    <el-button type="info" @click="handlePrint(scope.row.id)"> 打 单 </el-button>
                    <el-button type="success" @click="handleCashierDetail(scope.row.id)"> 明 细 </el-button>
                    <el-button class="bg-option" @click="handleUnCashier(scope.row.id)"> 反交班 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size.sync="pageTotal"></el-pagination>
		</div>
        <!-- 打单确认界面 -->
    <!-- <div id="dadan">
         <el-dialog title="确认操作" :visible.sync="dialogVisible" width="50%" center> 
        <div style="text-align:center;"><span style="margin:auto;" class="mtext">提示：此操作会从新打印订单</span></div><br>
        <el-form status-icon label-width="40%" class="demo-ruleForm">
        <el-form-item label="输入账户密码:">
        <el-input type="password" v-model="PayUndoQuery.password" auto-complete="off"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-button">取 消</el-button>
        <el-button class="submit-button" @click="printOrder">确 定</el-button>
        </span>
        </el-dialog>
    </div> -->
    <!-- 选择界面 -->
    <div id="choose">
        <el-dialog :title="dislogTitle" :visible.sync="dialogVisible1" width="70%" center> 
         <div style="text-align:center;"><span style="margin:auto;" class="mtext">{{chooseMessage}}</span></div><br>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" class="cancel-button">取消</el-button>
        <el-button @click="cashier()"  v-if="type ==1" class="submit-button">{{chooseButton}}</el-button>
        <el-button @click="printCashierInfo()" v-if="type ==2" class="submit-button">{{chooseButton}}</el-button>
        <el-button @click="unCashier()" v-if="type ==3" class="submit-button">{{chooseButton}}</el-button>
        </span>
        </el-dialog>
    </div>
			<!-- 交班界面 -->
	<el-dialog :title="dislogTitle" :visible.sync="cashierDialogVisible" width="80%">
		
		<el-form  ref="dataForm" label-position="right" label-width="150px" style='margin-left:0px;'>
			<div v-if="detail">
			<el-form-item label="选择店铺" >
			<el-select clearable v-model.number="sid" placeholder="选择店铺" >
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			</el-form-item>
			<el-form-item label="开始时间">
			<span>{{temp.time[0].start}}</span>
			</el-form-item>
			<el-form-item label="结束时间" >
			<span>{{temp.time[0].end}}</span>
			</el-form-item>
			</div>
			<el-form-item label="订单支付">
			<pay-info :list='temp.orderPay'></pay-info>
			</el-form-item>
			<el-form-item label="减免金额">
			<pay-info :list='temp.discount'></pay-info>
			</el-form-item>
			<el-form-item label="会员充值">
				<pay-info :list='temp.cPay'></pay-info>
			</el-form-item>
			<el-form-item label="会员开通">
				<pay-info :list='temp.kPay'></pay-info>
			</el-form-item>
			<el-form-item label="退款" v-if="detail">
				<pay-info :list='temp.reFundPay'></pay-info>
			</el-form-item>
			<el-form-item label="备注">
				<el-input placeholder="输入交班备注说明" v-model='remark'  type="textarea" :autosize="{ minRows:2,maxRows:4}" :disabled="!detail"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button class="cancel-button" @click="cashierDialogVisible = false">返回</el-button>
			<el-button v-if="detail"  class="submit-button" @click="handleYes()">确认交班</el-button>
			<!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
		</div>
	</el-dialog>
	</div>
	
    
</template>
<script >
	//引用路由方法 发送请求
	import {revenueData , getCashierList,cashier,getCashierInfo, getCashierDetail,UnCashier,PrintCashierInfo} from '@/api/data'
	import { shopList} from '@/api/pay'
    import { orderRePrint } from '@/api/order'
	import {dict} from '@/store'
	import PayInfo from './components/payInfo'
	import { displayShopFilter } from '@/filters'
    // import {getters} from '@/store/getters'

	export default{
		name: 'data-cashier',
		components: { PayInfo },

		data(){
			return {
				shopOptions:[],
				// typeOptions:[{id:0,name:'按照营业时间统计'},{id:1,name:'按照标准时间统计'}],
				listQuery:{
					p: 1,
					// type:undefined,
					createDT: undefined,
					sid: undefined,
				},
				tableKey:0,
				list:null,
				sumList:[],
				listLoding:true,
                total: null,
                pageTotal:null,
                dialogVisible:false,
				dialogVisible1:false,
				cashierDialogVisible:false,
				dislogTitle:undefined,
                PayUndoQuery:{
                    password:undefined,
                    oid:undefined,
                },
				chooseMessage:'',
				chooseButton:'',
				type:0,
				cashierId:undefined,
				isSum:false,
				pickerOptions2: {
		            shortcuts: [{
		              text: '24小时内',
		              onClick(picker) {
		                const end = new Date();
		                const start = new Date();
		                start.setTime(start.getTime() - 3600 * 1000 * 24);
		                picker.$emit('pick', [start, end]);
		              }
		            }, {
		              text: '最近一周',
		              onClick(picker) {
		                const end = new Date();
		                const start = new Date();
		                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		                picker.$emit('pick', [start, end]);
		              }
		            },{
		              text: '最近一个月',
		              onClick(picker) {
		                const end = new Date();
		                const start = new Date();
		                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		                picker.$emit('pick', [start, end]);
		              }
		            }, {
		              text: '最近三个月',
		              onClick(picker) {
		                const end = new Date();
		                const start = new Date();
		                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		                picker.$emit('pick', [start, end]);
		              }
		           }]
				},
				tempData:[],
				temp:{
					time:[{start:undefined,end:undefined}],
					orderPay:[],
					kPay:[],
					cPay:[],
					reFundPay:[],
				},
				sid:undefined,
				remark:'',
				detail:true,
							
			}
		},
		filters:{
		},
		created(){
			this.listQuery.sid = this.$store.getters.session.sid
            shopList().then(response => {
			// this.shopOptions = response.data.list
			this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.list)
            })
			this.getList()
		},
		computed:{},
		watch:{},
		methods:{
			getList(){
				this.listLoding = true
				this.listQuery.createDT = this.listQuery.createDT ? this.listQuery.createDT.join(",") : undefined
				getCashierList(this.listQuery).then(response =>{
					this.listQuery.createDT = this.listQuery.createDT ? this.listQuery.createDT.split(",") : undefined
					this.list = response.data.list
					// this.sumList = response.data.totalData
                    this.total = response.data.count
					this.pageTotal = 30
					// this.isSum = this.total>0?true:false
					this.listLoding = false
				})
				// console.log(this.$store.getters.name)
				
            },
         
			handleFilter(){
				this.listQuery.p = 1
				this.getList()
			},
             handleSizeChange(val) {
                this.listQuery.limit = val
                this.getList()
            },
			handleCurrentChange(val){
				this.listQuery.p = val
				this.getList()
            },
            displayNameFilter(id, options) {
      		const finded = options.find((option) => option.id === id)
      		if (finded) {
        		return finded.name
      			}
            },
            printOrder(){
            // orderRePrint(this.PayUndoQuery).then(response => {
            //     this.$notify({
            //         title: '成功',
            //         message: response.msg,
            //         type: response.code === 200?'success' : 'danger',
            //         duration: 2000
            //     })
            // })

            },
            handleOrderPrint(id){
            this.dialogVisible = true
            this.PayUndoQuery.oid = id
            },
            handleCashier(){
					this.detail = true
					 this.sid = this.listQuery.sid
					//  this.sid = this.$store.getters.sid
					getCashierInfo({sid:this.sid}).then(response => {
					this.temp.time = response.data.time
					this.temp.orderPay = response.data.orderPay
					this.temp.kPay = response.data.kPay
					this.temp.cPay = response.data.cPay
					this.temp.reFundPay = response.data.reFundPay
					this.temp.discount = response.data.discount
					// console.log(this.temp.orderPay)
					this.dislogTitle = this.$store.getters.name + '交班'
					this.cashierDialogVisible = true
				})
			},
			handleCashierDetail(id){
				getCashierDetail(id).then(response => {
					// console.log(response)
					// this.temp.time = response.data.time
					this.temp.orderPay = response.data.orderPay
					this.temp.kPay = response.data.kPay
					this.temp.cPay = response.data.cPay
					// this.temp.reFundPay = response.data.reFundPay
					// console.log(this.temp.orderPay)
					this.dislogTitle = this.$store.getters.name + '交班明细'
					this.detail = false
					this.cashierDialogVisible = true
					
				})
			},
			cashier(){
				cashier({sid:this.sid,fromDTint:this.temp.time[0].startInt,remark:this.remark}).then(response =>{
				this.dialogVisible1 = false
				this.cashierDialogVisible = false
				this.getList()
				this.$message({
					message: response.msg,
					type: response.code == 200?'success':'denger'
					});
				})
			},
			unCashier(){
				UnCashier(this.cashierId).then(response =>{
				this.dialogVisible1 = false
				this.getList()
				this.$message({
					message: response.msg,
					type: response.code == 200?'success':'denger'
					});
				})
			},
			printCashierInfo(){
				PrintCashierInfo(this.cashierId).then(response =>{
				this.dialogVisible1 = false
				this.$message({
					message: response.msg,
					type: response.code == 200?'success':'denger'
					});
				})
			},
			getCashierDetail(){
				getCashierDetail().then(response => {
					this.temp = response.data
				})
			},
			handleYes(){
				this.type =1;
				this.chooseMessage =this.$store.getters.name +'，你确定要交班吗，交班之后,属于本班次的交班数据会重新初始化哦！'
				this.chooseButton ='再次确认交班'
                this.dialogVisible1 = true
			},
			handlePrint(id){
				this.type =2;
				this.cashierId = id;
				this.chooseMessage =this.$store.getters.name +'，你确定要打印交班数据吗？'
				this.chooseButton ='打印'
                this.dialogVisible1 = true
			},
			handleUnCashier(id){
				this.type =3;
				this.cashierId = id;
				this.chooseMessage =this.$store.getters.name +'，你确定要取消交班吗？'
				this.chooseButton ='再次确认取消交班'
                this.dialogVisible1 = true
			}

		}
	}
</script>


<style lang="stylus" scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 50%;
}
.bg-option{
  background: #F56C6C;
  color:#fff;
}
.cancel-button{
  width: 35%;
  font-size: 1rem;
  margin-top: 20px;
}
.submit-button{
  width: 35%;
  background: green;
  color:#fff;
  font-size: 1rem;
  margin-top: 20px;
}
.mtext{
  font-size: 1rem;
  line-height: 1.5rem;
}
.sumDiv{
	display:flex
	.sum{
		width:11rem
		text-align :center
	}
}
</style>
<style>
#dadan .el-form-item__label{
  font-size: 1rem;
  line-height: 1.5rem;
}

</style>

