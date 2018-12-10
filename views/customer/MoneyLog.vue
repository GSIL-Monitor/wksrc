<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 150px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 150px" v-model="listQuery.opType" placeholder="变动类型">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-input @keyup.enter.native="handleFilter" style="width: 130px;"  placeholder="客户ID" v-model="listQuery.cid"></el-input>

    		<el-date-picker  v-model="searchDT" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>

			<el-button  type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">

			<el-table-column align="center" label="记录ID" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.sid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="金额类型" width="150">
				<template slot-scope="scope">
					<span>{{feeOptions[scope.row.isSrv]}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="变动金额" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.fund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作类型" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.opTypeStr}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作时间" width="170">
				<template slot-scope="scope">
					<span>{{scope.row.opDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="当前余额" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.leftFund}}</span>
				</template>
			</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size="20" ></el-pagination>
		</div>
	</div>
	
</template>
<script >
	//引用路由方法 发送请求
	import { fetchMeneyLogList,fetchShopList} from '@/api/customer'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'customer-moneyLog',
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
				shopOptions:[],
				typeOptions:[{id:0,name:'会员充值'},{id:1,name:'会员消费'},{id:2,name:'后台操作'},{id:3,name:'订单退款'},{id:4,name:'余额转让'},{id:5,name:'实体卡转'},{id:6,name:'退现金'},{id:7,name:'微信支付退款'},{id:8,name:'余额转出'},{id:9,name:'余额转入'},{id:10,name:'内部提成'},{id:11,name:'创客提成'},{id:12,name:'微客乐购'},{id:14,name:'支付宝退款'}],
				feeOptions:{0:'余额',1:'服务费余额'},
				listQuery:{
					p: 1,
					cid:undefined,
					opType: undefined,
					sid: undefined,
					
				},
				searchDT:undefined,
				value5:undefined,
				tableKey:0,
				list:null,
				listLoding:true,
				total: null,
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
			if (this.$route.params.id != null) {
				this.listQuery.cid = this.$route.params.id
			}
			fetchShopList().then(response => {
				// this.shopOptions=response.data.list
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
				fetchMeneyLogList(this.listQuery).then(response =>{
					this.list = response.data.list
					this.total = response.data.count
					this.listLoding = false
					// console.log(this.list)

				})
				
			},
			
			handleFilter(){
				this.listQuery.p = 1
				this.getList()
			},
		
			handleCurrentChange(val){
				this.listQuery.p = val
				this.getList()
			},

		}
	}
</script>

<style scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}
</style>
