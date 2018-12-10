<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable class="filter-item" style="width: 120px" v-model="listQuery.cLevel" placeholder="顾客适用等级">
				<el-option v-for="item in levelOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

			<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" icon="el-icon-edit">{{$t('table.add')}}</el-button>
		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="ID" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.sid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="充值金额" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.fee}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="赠送金额(发票)" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.giftFund2}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="赠送金额" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.giftFund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="赠送服务费" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.giftFundSrv}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="顾客适用等级" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.cLevel}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="等级更变" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.ncLevel}}</span>
				</template>
			</el-table-column>
	<!-- 		<el-table-column align="center" label="赠送积分" width="100">
				<template slot-scope="score">
					<span>{{scope.row.score}}</span>
				</template>
			</el-table-column> -->
				<el-table-column align="center" label="备注" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.remark}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" min-width="200">
      		<template slot-scope="scope">
        	<el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        	<el-button type="danger" @click="handleDelete(scope.row)" size="small" disabled icon="el-icon-delete">删除</el-button>
      		</template>
    		</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size="20"></el-pagination>
		</div>

		<!-- 新建和修改界面 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px"
 style='margin-left:0px;'>
			 
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model.number="temp.sid" placeholder="选择店铺">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="顾客适用等级" prop="cLevel">
				 <el-select clearable v-model="temp.cLevel" placeholder="顾客适用等级">
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 	<!-- <el-input placeholder="顾客适用等级" v-model.number='temp.cLevel'></el-input> -->
			 </el-form-item>
			 <el-form-item label="等级更变" prop="ncLevel">
				<el-select clearable v-model="temp.ncLevel" placeholder="等级更变">
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 	<!-- <el-input placeholder="充值后等级" v-model.number='temp.ncLevel'></el-input> -->
			 </el-form-item>
			 <el-form-item label="排序" prop="showId">
			 	<el-input placeholder="排序" v-model.number='temp.showId'></el-input>
			 </el-form-item>
			  <el-form-item label="充值金额" prop="fee">
			 	<el-input placeholder="充值金额" v-model.number='temp.fee'></el-input>
			 </el-form-item>
			   <el-form-item label="赠送金额(发票)" prop="giftFund">
			 	<el-input placeholder="赠送金额" v-model.number='temp.giftFund2'></el-input>
			 </el-form-item>
			   <el-form-item label="赠送金额" prop="giftFund">
			 	<el-input placeholder="赠送金额" v-model.number='temp.giftFund'></el-input>
			 </el-form-item>
			  </el-form-item>
			   <el-form-item label="赠送服务费" prop="giftFundSrv">
			 	<el-input placeholder="赠送服务费" v-model.number='temp.giftFundSrv'></el-input>
			 </el-form-item>
			  </el-form-item>
			   <el-form-item label="增送卡卷" prop="score">
				   <el-select clearable multiple v-model="temp.cpid" placeholder="不送">
			 		<el-option v-for="item in lajuan" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 	<!-- <el-input placeholder="不送" v-model='temp.score'></el-input> -->
			 </el-form-item>
			 <el-form-item label="备注" prop="remark">
			 	<el-input placeholder="备注" v-model='temp.remark'></el-input>
			 </el-form-item>
		

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus == 'created'" type="primary" @click="createDate">{{$t('table.confirm')}}</el-button>
				<el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
			</div>
		</el-dialog>

		
	</div>
	
</template>
<script >
	//引用路由方法 发送请求
	import { fetchmChargeCFGList,fetchmChargeCFG,fetchShopList} from '@/api/customer'
	import {createmChargeCFG, updatemChargeCFG} from '@/api/customer'


	// import waves from '@/directive/waves' 
	// import {parseTime} from '@/utils'
	import { dict} from '@/store'

	export default{
		name: 'member-mcfg',
		props:{
			type:{
				type:String
			}
		},

		data(){
			return {
				shopOptions:[],
				levelOptions:[],
				lajuan:[],
				listQuery:{
					p: 1,
					cLevel: undefined,
					sid: undefined,
				},
				tableKey:0,
				list:null,
				listLoding:false,
				total: null,
				dialogStatus:'',
				textMap:{
					update:'修改充值设置',
					created:'添加充值设置',
				},
				dialogFormVisible:false,

				temp:{
					sid:undefined,
					cLevel:undefined,
					showId:undefined,
					fee:undefined,
					giftFund:undefined,
					giftFund2:undefined,
					giftFundSrv:undefined,
					score:undefined,
					cpid:undefined,
					remark:undefined,
			
				},
				rules:{
					sid:[{required:true}],
					cLevel:[{required:true}],
					ncLevel:[{required:true}],
					fee:[{required:true}],
				},

						
			}
		},
		filters:{
			//判断返回的信息样式
			statusFilter(status){
				const statusMap = {
				published:'success',
				draft:'info',
				deleted:'danger'
			}
			return statusMap[status]
			}

		},
		created(){
			dict('cLevel').then(response=>{
				this.levelOptions = response
			})
			fetchShopList().then(response => {
				this.shopOptions=response.data.list
			})
			this.getList()
			
		},
		computed:{},
		watch:{},
		methods:{
			getList(){
				this.listLoding = true
				fetchmChargeCFGList(this.listQuery).then(response =>{
					this.list = response.data.list
					this.total = response.data.count

					console.log(this.list)

				})
				this.listLoding = false
			},
			resetTemp(){
				this.temp={
					sid:undefined,
					cLevel:undefined,
					showId:undefined,
					fee:undefined,
					giftFund:undefined,
					giftFund2:undefined,
					giftFundSrv:undefined,
					score:undefined,
					remark:undefined,
				}
			},
			handleFilter(){
				this.listQuery.p = 1
				this.getList()
			},
			handleCreate(){
				this.resetTemp()
				this.dialogStatus = 'created'
				this.dialogFormVisible = true
				this.$nextTick(() => {
        		this.$refs['dataForm'].clearValidate()
      })
			},
			handleUpdate(row){
				fetchmChargeCFG(row.id).then(response=>{
				this.temp = response.data
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(()=>{	
				this.$refs['dataForm'].clearValidate()
				})
				})
				
				
			},
			handleDelete(row){

			},
			//分页方法
			// handleSizeChange(val){
			// 	this.listQuery.limit = val
			// 	this.getlist()
			// },
			handleCurrentChange(val){
				this.listQuery.p = val
				this.getList()
			},


			

			createDate(){
				this.$refs['dataForm'].validate((valid) =>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						// tempData = this.remapData(tempData)
						createmChargeCFG(tempData).then(()=>{
							this.list.unshift(this.temp)
							this.dialogFormVisible = false
							this.getList()
							this.$notify({
								title:'成功',
								message:'创建成功',
								'type':'success',
								'duiation':2000
							})
						})
					}
				})

			},
			updateData(){
				this.$refs['dataForm'].validate((valid)=>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						// console.log(tempData)
						updatemChargeCFG(tempData.id,tempData).then(() => {
					for (const v of this.list) {
		              if (v.id === this.temp.id) {
		                const index = this.list.indexOf(v)
		                this.list.splice(index, 1, this.temp)
		                break
		              }
		            }
		              this.dialogFormVisible = false
			            this.$notify({
			              title: '成功',
			              message: '更新成功',
			              type: 'success',
			              duration: 2000
			            })
            
						})
					}
				})
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
