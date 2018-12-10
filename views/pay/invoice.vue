<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 140px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-input clearable @keyup.enter.native="handleFilter" style="width: 180px;"  placeholder="客户ID/者手机卡/卡号" v-model="listQuery.selectId"></el-input>
			<el-select clearable  style="width: 120px" v-model="listQuery.opType" placeholder="操作类型">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.refType" placeholder="关联支付类型">
				<el-option v-for="item in payOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-date-picker  v-model="searchDT" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"> </el-date-picker>
			<el-button  type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">

			<el-table-column align="center" label="顾客ID">
				<template slot-scope="scope">
					<span>{{scope.row.vid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="日期">
				<template slot-scope="scope">
					<span>{{scope.row.opDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作类型" >
				<template slot-scope="scope">
					<span>{{scope.row.opType | displayNameFilter(typeOptions)}}</span>
				</template>
			</el-table-column>
		
			<el-table-column align="center" label="金额" >
				<template slot-scope="scope">
					<span>{{scope.row.fund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="变动前余额" >
				<template slot-scope="scope">
					<span>{{scope.row.leftFund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作员" >
				<template slot-scope="scope">
					<span >{{scope.row.opStaf}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付内部ID" >
				<template slot-scope="scope">
					<span>{{scope.row.refID }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付类型" >
				<template slot-scope="scope">
					<span>{{scope.row.refType | displayNameFilter(payOptions)}}</span>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="操作" width="180">
				<template slot-scope="scope">
                    <!-- <el-button class="bg-option" @click="handleOrderPrint(scope.row.oid)"> 打 单 </el-button>
					<el-button class="bg-option" @click="handleReFund(scope.row)"> 退 款 </el-button> -->
				</template>
			</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" 	:page-size='20'></el-pagination>
		</div>
		</div>
</template>
<script >
	//引用路由方法 发送请求
    import { fetchInvoiceLogList,shopList} from '@/api/pay'
	import {dict} from '@/store'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'payInfo-incoice',
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
				shopOptions:[],
				typeOptions:[{id:0,name:'开票金额累加'}, {id:1,name:'开发票'}, {id:2,name:'现金抵扣'}],
				payOptions:[{id:0,name:'订单记录'},{id:1,name:'充值/会员开通记录'}],
				listQuery:{
					p: 1,
					selectId:undefined,
					opType:undefined,
					sid: undefined,
					refType:undefined,
				},
				tableKey:0,
				list:null,
				listLoding:true,
                total: null,
                pageTotal:null,
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
				searchDT:undefined,
							
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
				if(this.searchDT != undefined ){

					this.listQuery.startTime = this.searchDT[0] 
					this.listQuery.endTime = this.searchDT[1] 
				}
				fetchInvoiceLogList(this.listQuery).then(response =>{
					this.list = response.data.list
                    this.total = response.data.count
                    this.pageTotal = response.data.list.length
					this.listLoding = false
					

				})
				
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
</style>
<style>
#dadan .el-form-item__label{
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>

