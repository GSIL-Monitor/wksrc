
<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 140px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.opType" placeholder="统计方式">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
    		<el-date-picker  v-model="listQuery.createDT" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"> </el-date-picker>

			<el-button  type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="日期">
				<template slot-scope="scope">
					<span>{{scope.row.dataDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="微信充值">
				<template slot-scope="scope">
					<span>{{scope.row.wxPay}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="现金充值">
				<template slot-scope="scope">
					<span>{{scope.row.cashPay}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="刷卡充值">
				<template slot-scope="scope">
					<span>{{scope.row.cardPay}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="	挂账充值">
				<template slot-scope="scope">
					<span>{{scope.row.tCardPay}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="公司招待充值">
				<template slot-scope="scope">
					<span>{{scope.row.entertain}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="	支付宝">
				<template slot-scope="scope">
					<span>{{scope.row.payTreasure}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="赠送金额">
				<template slot-scope="scope">
					<span>{{scope.row.giftSum}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="退款金额">
				<template slot-scope="scope">
					<span>{{scope.row.reFund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="实收金额">
				<template slot-scope="scope">
					<span>{{scope.row.sumFund - scope.row.reFund}}</span>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
                    <el-button class="bg-option" @click="handlePrint(scope.row)"> 打 单 </el-button>
				</template>
			</el-table-column>
			
		</el-table>
		<div v-if="isSum" class="sumDiv">
			<div class="sum" style="min-width:80px;">总计</div>
		<div class="sum" style="min-width:80px;" v-for="sum in sumList">{{sum}}</div>
		 <div class="sum"> <el-button class="bg-option" @click="handlePrintSum(sumList)"> 打 单 </el-button> </div>
		</div>
		<div class="pagination-container">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size.sync="pageTotal"></el-pagination>
		</div>
        <!-- 打单确认界面 -->
    <div id="dadan">
        <el-dialog title="输入当前账号密码" :visible.sync="dialogVisible" width="50%" center> 
        <!-- <div style="text-align:center;"><span style="margin:auto;" class="mtext">提示：此操作会从新打印订单</span></div><br> -->
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
    </div>
    <!-- 退款界面 -->
    <!-- <div id="tukuan">
        <el-dialog title="退款信息" :visible.sync="dialogVisible1" width="80%" center> 
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
	</div>
	
    
</template>
<script >
	//引用路由方法 发送请求
	import {getDepositList,PrintDepositList} from '@/api/data'
	import { shopList} from '@/api/pay'
    import { orderRePrint } from '@/api/order'
	import {dict} from '@/store'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'topup-data',
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
				shopOptions:[],
				typeOptions:[{id:0,name:'按照营业时间统计'},{id:1,name:'按照标准时间统计'}],
				listQuery:{
					p: 1,
					type:undefined,
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
                PayUndoQuery:{
                    password:undefined,
                    oid:undefined,
                },
				dialogVisible1 : false,
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
							
			}
		},
		filters:{

		},
		created(){
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
				getDepositList(this.listQuery).then(response =>{
					this.listQuery.createDT = this.listQuery.createDT ? this.listQuery.createDT.split(",") : undefined
					this.list = response.data.list
					this.sumList = response.data.totalData
                    this.total = response.data.count
					this.pageTotal = 30
					this.isSum = this.total>0?true:false
					this.listLoding = false
				})
				
            },
            restReFund(){
                this.ReFundQuery={
                    cid:undefined,
                    tradNo2:undefined,
                    sid:undefined,
                    payType:undefined,
                    remark:undefined,
                    sumReFund:undefined,
                    password:undefined,
                }
                
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
          

            },
            handlePrint(row){
              PrintDepositList(row).then(response => {
                this.$notify({
                    title: '打印充值数据',
                    message: response.msg,
                    type: response.code === 200?'success' : 'danger',
                    duration: 2000
                })
            })
            },
            handlePrintSum(row){
				const tempData = Object.assign({},row);
				tempData.dataDT = this.listQuery.createDT[0] +' <--> ' +this.listQuery.createDT[1];
				tempData.wxPay = row.SwxPay
				tempData.cashPay = row.ScashPay
				tempData.cardPay = row.ScardPay
				tempData.entertain = row.Sentertain
				tempData.payTreasure = row.SpayTreasure
				tempData.tCardPay = row.StCardPay
				tempData.giftSum = row.SgiftSum
				tempData.reFund = row.SreFund
				tempData.sumFund = row.SsumFund
				console.log(tempData)
              PrintDepositList(tempData).then(response => {
                this.$notify({
                    title: '打印充值总计数据',
                    message: response.msg,
                    type: response.code === 200?'success' : 'danger',
                    duration: 2000
                })
            })
            },
            handleReFund(row){
                this.dialogVisible1 = true
                this.temps = row
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
		font-size:0.6rem
	}
}
</style>
<style>
#dadan .el-form-item__label{
  font-size: 1rem;
  line-height: 1.5rem;
}

</style>

