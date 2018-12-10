<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable  style="width: 140px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-input @keyup.enter.native="handleFilter" style="width: 80px;"  placeholder="客户ID" v-model="listQuery.cid"></el-input>
			<el-select clearable  style="width: 120px" v-model="listQuery.opType" placeholder="交易类型">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.payType" placeholder="支付方式">
				<el-option v-for="item in payOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable  style="width: 120px" v-model="listQuery.discountType" placeholder="优惠方式">
				<el-option v-for="item in discountOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
				
			</el-select>
			<el-input @keyup.enter.native="handleFilter" style="width: 80px;"  placeholder="商户单号" v-model="listQuery.oid"></el-input>
			<el-input @keyup.enter.native="handleFilter" style="width: 80px;"  placeholder="订单号" v-model="listQuery.tradNo"></el-input>
			<el-input @keyup.enter.native="handleFilter" style="width: 80px;"  placeholder="介绍员工" v-model="listQuery.opStaf"></el-input>
    		<!-- <el-date-picker  v-model="listQuery.tranDT" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"> </el-date-picker>  -->
			<el-date-picker  v-model="listQuery.tranDT" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd"> </el-date-picker>

			<el-button  type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">

			<el-table-column align="center" label="商户单号">
				<template slot-scope="scope">
					<span>{{scope.row.tradNo}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="日期">
				<template slot-scope="scope">
					<span>{{scope.row.tranDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="交易类型" >
				<template slot-scope="scope">
					<span>{{scope.row.opType | displayNameFilter(typeOptions)}}</span>
                    <!-- <span v-if="scope.row.sumFund <0">退款</span> -->
				</template>
			</el-table-column>
		
			<el-table-column align="center" label="金额" >
				<template slot-scope="scope">
					<span>{{scope.row.sumFund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="抹零金额" >
				<template slot-scope="scope">
					<span v-if="scope.row.opType == 1">{{scope.row.discountType | displayNameFilter(discountOptions)  + scope.row.inputdiscVal}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付方式" >
				<template slot-scope="scope">
					<span>{{scope.row.payType | displayNameFilter(payOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="订单号" >
				<template slot-scope="scope">
					<span>{{scope.row.oid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作账号" >
				<template slot-scope="scope">
					<span>{{scope.row.opStaf}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="介绍员工" >
				<template slot-scope="scope">
					<span>{{scope.row.auditStaf}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="交易店铺" >
				<template slot-scope="scope">
					<span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="顾客ID" >
				<template slot-scope="scope">
					<span>{{scope.row.vid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="备注" >
				<template slot-scope="scope">
					<span>{{scope.row.remark}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="180">
				<template slot-scope="scope">
                    <el-button class="bg-option" @click="handleOrderPrint(scope.row.oid)"> 打 单 </el-button>
					<el-button class="bg-option" @click="handleReFund(scope.row)"> 退 款 </el-button>
				</template>
			</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" 	:page-size='20'></el-pagination>
		</div>
        <!-- 打单确认界面 -->
    <div id="dadan">
        <el-dialog title="输入当前账号密码" :visible.sync="dialogVisible" width="50%" center> 
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
    </div>
    <!-- 退款界面 -->
    <div id="tukuan">
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
    </div>
	</div>
	
    
</template>
<script >
	//引用路由方法 发送请求
    import { fetchPayList,shopList} from '@/api/pay'
    import { orderRePrint } from '@/api/order'
	import {dict} from '@/store'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'payInfo-index',
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
				shopOptions:[],
				typeOptions:[],
				payOptions:[{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:3,name:'挂账'},{id:4,name:'公司招待'},{id:5,name:'会员支付'},{id:6,name:'转卡'},{id:7,name:'转账'},{id:8,name:'一卡通'},{id:9,name:'网购'},{id:10,name:'消费券'},{id:20,name:'支付宝'},{id:99,name:'组合支付'}],
				discountOptions:[],
				listQuery:{
					p: 1,
					cid:undefined,
					oid:undefined,
					payType:undefined,
					opType:undefined,
					tranDT: undefined,
					sid: undefined,
					trandNo:undefined,
					discountType:undefined,
				},
				tableKey:0,
				list:null,
				listLoding:true,
                total: null,
                pageTotal:null,
                dialogVisible:false,
                PayUndoQuery:{
                    password:undefined,
                    oid:undefined,
                },
                ReFundQuery:{
                    cid:undefined,
                    tradNo2:undefined,
                    sid:undefined,
                    payType:undefined,
                    remark:undefined,
                    sumReFund:undefined,
                    password:undefined,

                },
                temps:[],
                dialogVisible1 : false,
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
			this.listQuery.sid = this.$store.getters.session.sid
			dict('opType').then(response => {
            this.typeOptions = response
            this.typeOptions.push({id:99,name:'退款'})
            })
			dict('discountType').then(response => {
            this.discountOptions = response
            })
            // dict('oPayType',0,0,0).then(response => {
			// 	this.payOptions = response
			
            // })
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
				this.listQuery.tranDT = this.listQuery.tranDT ? this.listQuery.tranDT.join(",") : undefined
				fetchPayList(this.listQuery).then(response =>{
					this.listQuery.tranDT = this.listQuery.tranDT ? this.listQuery.tranDT.split(",") : undefined
					this.list = response.data.list
                    this.total = response.data.count
                    this.pageTotal = response.data.list.length
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
            orderRePrint(this.PayUndoQuery).then(response => {
                this.$notify({
                    title: '成功',
                    message: response.msg,
                    type: response.code === 200?'success' : 'danger',
                    duration: 2000
                })
            })

            },
            handleOrderPrint(id){
            this.dialogVisible = true
            this.PayUndoQuery.oid = id
            },
            handleReFund(row){
                // this.dialogVisible1 = true
                // this.temps = row
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
</style>
<style>
#dadan .el-form-item__label{
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>

