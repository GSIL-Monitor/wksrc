<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 140px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.otype" placeholder="订单类型">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.status" placeholder="订单状态">
				<el-option v-for="item in statusOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-date-picker  v-model="searchDT" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"> </el-date-picker>
			<el-input clearable @keyup.enter.native="handleFilter" style="width: 180px;"  placeholder="客户ID/卡号" v-model="listQuery.vid"></el-input>
			<el-input clearable @keyup.enter.native="handleFilter" style="width: 180px;"  placeholder="订单号" v-model="listQuery.number"></el-input>
			<el-input clearable @keyup.enter.native="handleFilter" style="width: 180px;"  placeholder="	餐桌(房间)号" v-model="listQuery.roomName"></el-input>
			<el-input clearable @keyup.enter.native="handleFilter" style="width: 180px;"  placeholder="餐桌系统ID" v-model="listQuery.roomID"></el-input>
			<el-button  type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">

			<el-table-column align="center" label="	下单时间">
				<template slot-scope="scope">
					<span>{{scope.row.createDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="顾客id">
				<template slot-scope="scope">
					<span>{{scope.row.cid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="	订单号">
				<template slot-scope="scope">
					<span>{{scope.row.number}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" >
				<template slot-scope="scope">
					<span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="	房间号">
				<template slot-scope="scope">
					<span>{{scope.row.roomNumber}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="订单类型" >
				<template slot-scope="scope">
					<span>{{scope.row.otype | displayNameFilter(typeOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="订单状态" >
				<template slot-scope="scope">
					<span>{{scope.row.status | displayNameFilter(statusOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付状态" >
				<template slot-scope="scope">
					<span>{{scope.row.payflag | displayNameFilter(payStatusOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付方式" >
				<template slot-scope="scope">
					<span>{{scope.row.oPayType | displayNameFilter(payTypeOptions)}}</span>
				</template>
			</el-table-column>
		
			<el-table-column align="center" label="订单总价" >
				<template slot-scope="scope">
					<span>{{scope.row.sumFee}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="实付金额" >
				<template slot-scope="scope">
					<span>{{scope.row.payFee}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作员" >
				<template slot-scope="scope">
					<span >{{scope.row.opStaf}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付时间" >
				<template slot-scope="scope">
					<span>{{scope.row.payDT }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label="最后修改" >
				<template slot-scope="scope">
					<span>{{scope.row.modifyDT }}</span>
				</template>
			</el-table-column> -->
			<el-table-column align="center" label="备注" >
				<template slot-scope="scope">
					<span>{{scope.row.remark }}</span>
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
    import {shopList} from '@/api/pay'
    import { fetchOrderList } from '@/api/order'
	import {dict} from '@/store'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'payInfo-order',
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
				shopOptions:[],
				payTypeOptions:[],
				typeOptions:[],
				statusOptions:[],
				payStatusOptions:[{id:0,name:'待支付'}, {id:1,name:'已支付'}, {id:2,name:'挂账'}],

				listQuery:{
					p: 1,
					vid:undefined,
					otype:undefined,
					sid: undefined,
					status:undefined,
					number:undefined,
					roomID:undefined,
					roomName:undefined,
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
			dict('oPayType',0).then(response => {
				this.payTypeOptions = response
            })
			dict('oType',0).then(response => {
				this.typeOptions = response
            })
			dict('oStatus',0).then(response => {
				this.statusOptions = response
            })
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
					this.listQuery.createDT = this.searchDT[0] +','+this.searchDT[1] 
				}

				if(this.listQuery.otype ==''){
					this.listQuery.otype = undefined
				}
				if(this.listQuery.sid ==''){
					this.listQuery.sid = undefined
				}
				if(this.listQuery.status ==''){
					this.listQuery.status = undefined
				}
				if(this.listQuery.number ==''){
					this.listQuery.number = undefined
				}
				if(this.listQuery.roomID ==''){
					this.listQuery.roomID = undefined
				}
				if(this.listQuery.roomName ==''){
					this.listQuery.roomName = undefined
				}
				fetchOrderList(this.listQuery).then(response =>{
					this.list = response.data.list
                    this.total = response.data.total
                    this.pageTotal = response.data.count
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

