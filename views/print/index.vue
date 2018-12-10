<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.sid" :placeholder="$t('print.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.ptrType" :placeholder="$t('print.ptrType')">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.merchantId" placeholder="打印商户">
				<el-option v-for="item in merchantOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" :placeholder="$t('print.name')" v-model="listQuery.name"></el-input>
			<el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

			<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" icon="el-icon-edit">{{$t('table.add')}}</el-button>
		</div>

		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="ID" width="50">
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="打印设置名称" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属区域" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.areaStr}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="打印类型" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.ptrType | displayNameFilter(typeOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="打印商户" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.merchantId | displayNameFilter(merchantOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="打印机编码" width="200">
				<template slot-scope="scope">
					<span>{{scope.row.codeNO}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="岗位" width="100">
				<template slot-scope="scope">
					<!-- <span>{{scope.row.workAreaId | displayNameFilter(workAreaOptions)}}</span> -->
					<span>{{scope.row.workAreaId}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="打印份数" width="85">
				<template slot-scope="scope">
					<span>{{scope.row.ptrNum}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" min-width="200">
      		<template slot-scope="scope">
        	<el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        	<el-button type="success" @click='getPtrStatus(scope.row)' size="small">查看状态</el-button>
        	<el-button type="danger" @click='delCFG(scope.row)' size="small"  icon="el-icon-delete">删除</el-button>
      		</template>
    		</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size="20"></el-pagination>
		</div>

		<!-- 打印设置新建和修改界面 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px"
 style='margin-left:0px;'>
			 <el-form-item label="打印设置名称" prop="name">
			 	<el-input placeholder="输入打印设置名称" v-model='temp.name'></el-input>
			 </el-form-item>
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model.number="temp.sid" placeholder="选择店铺" @change="getArea">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="所在区域" prop="areaId">
			 	<!-- <el-input placeholder="选择所在区域" v-model='temp.areaId'></el-input> -->
			 	<el-select v-model.number="temp.areaId" placeholder="选择所在区域" @change="getWorkArea">
			 		<el-option v-for="item in areaOptons" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <!-- <el-form-item label="工作区(岗位)" prop="workAreaId">
				 <el-select v-model.number="temp.workAreaId" placeholder="工作区(岗位)" >
			 		<el-option v-for="item in workAreaOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item> -->
			 <el-form-item label="工作区(岗位)" prop="workAreaId">
				 <!-- <el-select v-model.number="temp.workAreaId" placeholder="工作区(岗位)" >
			 		<el-option v-for="item in workAreaOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select> -->
				 <!-- <span v-for="item in workAreaOptions" >
				 <input type="checkbox"  :value="item.id" v-model="temp.workAreaId">
				 <label>{{item.name}}</label>
				 </span> -->
				 <el-checkbox-group v-model="temp.workAreaId">
                     <el-checkbox v-for="workArea in workAreaOptions" :label="workArea.id" :key="workArea.id">{{workArea.name}}</el-checkbox>
                </el-checkbox-group>
			 </el-form-item>
			 <el-form-item label="打印类型" prop="ptrType">
			 	<el-select v-model.number="temp.ptrType" placeholder="选择打印类型" >
			 		<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="打印机编号" prop="codeNO">
			 	<el-input placeholder="输入打印机编号" v-model='temp.codeNO'></el-input>
			 </el-form-item>
			 <el-form-item label="打印机商户" prop="merchantId">
			 	<el-select v-model.number="temp.merchantId" placeholder="选择打印机商户" >
			 		<el-option v-for="item in merchantOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item v-if="temp.merchantId == 2" label="打印机ip地址" :required="temp.merchantId == 2" prop="ips">
			 	<el-input placeholder="输入打印机绑定的ip地址" v-model='temp.ips'></el-input>
			 </el-form-item>
			 <el-form-item label="打印份数" prop="ptrNum">
			 	<el-input placeholder="输入打印份数" v-model.number='temp.ptrNum'></el-input>
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
	import { fetchPtrCFG, fetchPtrCFGList, fetchSRoomArea, fetchWorkArea} from '@/api/print'
	import {createPrintcfg, updatePtrCFG ,getPtrStatus,delPtrCFG , getMerchantList} from '@/api/print'


	import waves from '@/directive/waves' 
	import {parseTime} from '@/utils'
	import { dict} from '@/store'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'print-index',
		directories:{
			waves
		},

		data(){
			return {
				shopOptions:[],
				merchantOptions:[],
				typeOptions:[{id:0,name:"收银小票打印"},{id:1,name:"厨房打单"},{id:2,name:"楼面打单"}],
				listQuery:{
					p: 1,
					name: undefined,
					sid: undefined,
					ptrType: undefined,
					merchantId:undefined,
				},
				tableKey:0,
				list:null,
				listLoding:false,
				total: null,
				dialogStatus:'',
				textMap:{
					update:'修改打印设置',
					created:'添加打印设置',
				},
				dialogFormVisible:false,

				temp:{
					sid:undefined,
					areaId:undefined,
					name:undefined,
					ptrNum:undefined,
					ptrType:undefined,
					codeNO:undefined,
					workAreaId:[],
					merchantId:1,
					ips:undefined,
				},
				rules:{
					sid:[{type:'integer'}],
					areaId:[{type:'integer'}],
					name:[{type:'string'}],
					ptrNum:[{type:'integer'}],
					ptrType:[{required:true,type:'integer'}],
					codeNO:[{required:true}],
					merchantId:[{required:true}],
					ips:[],
					
				},

				areaOptons:[],
				workAreaOptions:[],				
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
			this.listQuery.sid = this.$store.getters.session.sid
			this.getList()
			getMerchantList().then(response => {
				this.merchantOptions = response.data.list
			})
			// dict("cLevel").then(response => {
			// this.typeOptions = response;
			// });
		},
		computed:{},
		watch:{},
		methods:{
			displayNameFilter(sid, options) {
      		const finded = options.find((option) => option.id === sid)
      		if (finded) {
        		return finded.name
      			} else {
        			console.log(sid)
      			}
    			},
			getList(){
				this.listLoding = true
				fetchPtrCFGList(this.listQuery).then(response =>{
					this.list = response.data.list
					// this.shopOptions = response.shopList
					this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.shopList)
					this.total = response.data.count

					console.log(this.list)
					this.listLoding = false
				})
				
			},
			resetTemp(){
				this.temp={
					sid: undefined,
					areaId: undefined,
					name: undefined,
					ptrNum: undefined,
					ptrType: undefined,
					codeNO: undefined,
					workAreaId: [],
					merchantId:undefined,
					ips:undefined,
				}
			},
			handleFilter(){
				this.listQuery.p = 1
				this.getList()
			},
			handleCreate(){
				this.workAreaOptions= []
				this.resetTemp()
				this.dialogStatus = 'created'
				this.dialogFormVisible = true
				this.$nextTick(() => {
        		this.$refs['dataForm'].clearValidate()
      })
			},
			handleUpdate(row){
				fetchPtrCFG(row.id).then(response=>{
					this.temp = response.data;
				fetchWorkArea({upid:row.areaId,sid:row.sid}).then(response => {
					this.workAreaOptions = response.data.list
				})
				fetchSRoomArea({sid:row.sid}).then(response =>{
					this.areaOptons = response.data.list
				})
				if(this.temp.workAreaId !=null){
					this.temp.workAreaId = this.temp.workAreaId.toString().split(',').map(function(data){  return +data;   });
				}
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				})
				
			},
			getPtrStatus(row){
				getPtrStatus(row.codeNO).then(response =>{
					this.$message({
						message: response.msg === null ?'没有此ID的打印机':response.msg,
						type: 'success'
						});
				})
			},
			delCFG(row){
				delPtrCFG(row.id).then(response =>{
					this.getList()
					this.$message({
						message: response.msg,
						type: response.code === 200 ?'success':'denger'
						});
				})
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


			getArea(sid){
				fetchSRoomArea({sid}).then(response =>{
					this.areaOptons = response.data.list
				})
			},
			getWorkArea(upid){
				this.workAreaOptions =[]
				fetchWorkArea({upid,sid:this.temp.sid}).then(response => {
					this.workAreaOptions = response.data.list
				})
			},
			createDate(){
				this.$refs['dataForm'].validate((valid) =>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						tempData.workAreaId = tempData.workAreaId.join(',')
						// tempData = this.remapData(tempData)
						createPrintcfg(tempData).then(()=>{
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
			// remapData(data){
			// 	if (Array.isArray(data.openT)) {
			// 		data.openT.spl
			// 	}
			// },
			updateData(){
				this.$refs['dataForm'].validate((valid)=>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						console.log(tempData)
						if(tempData.workAreaId instanceof Array){
							tempData.workAreaId = tempData.workAreaId.join(',')
						}
					updatePtrCFG(tempData.id,tempData).then(response => {
					this.getList()
		              this.dialogFormVisible = false
			            this.$notify({
			              title: '打印设置',
			              message:response.msg,
			              type: response.code === 200 ?'success':'denger',
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
