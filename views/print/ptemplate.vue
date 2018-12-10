<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.sid" :placeholder="$t('print.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			
			<el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" :placeholder="$t('print.title')" v-model="listQuery.title"></el-input>
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
					<span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="模板调用字符" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="模板名称" width="200">
				<template slot-scope="scope">
					<span>{{scope.row.title}}</span>
				</template>
			</el-table-column>
		<!-- 	<el-table-column align="center" label="模板内容" width="300">
				<template slot-scope="scope">
					<span>{{scope.row.tpl}}</span>
				</template>
			</el-table-column> -->

			<el-table-column align="center" label="操作" min-width="200">
      		<template slot-scope="scope">
        	<el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        	<el-button type="danger" @click="handleDelete(scope.row)" size="small" disabled icon="el-icon-delete">删除</el-button>
      		</template>
    		</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total"  page-size.sync="10"></el-pagination>
		</div>

		<!-- 打印模板新建和修改界面 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px"
 style='margin-left:0px;'>
			 <el-form-item label="模板名称" prop="title">
			 	<el-input placeholder="模板名称" v-model='temp.title'></el-input>
			 </el-form-item>
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model.number="temp.sid" placeholder="选择店铺" >
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="模板英文调用名" prop="name">
			 	<el-input placeholder="输入英文调用名" v-model='temp.name'></el-input>
			 </el-form-item>
			 <el-form-item label="模板内容" prop="tpl">
			 	<el-input placeholder="输入模板内容" v-model='temp.tpl'  type="textarea" :autosize="{ minRows:15,maxRows:50}"></el-input>
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
	import { fetchPtrTplList} from '@/api/print'
	import {createPtrTpl, fetchPtrTpl,updatePtrTpl} from '@/api/print'
	import { displayShopFilter } from '@/filters'

	import waves from '@/directive/waves' 
	import {parseTime} from '@/utils'
	import { dict} from '@/store'

	export default{
		name: 'print-template',
		directories:{
			waves
		},

		data(){
			return {
				shopOptions:[],
				listQuery:{
					p: 1,
					title: undefined,
					sid: undefined,
				},
				tableKey:0,
				list:null,
				listLoding:false,
				total: null,
				dialogStatus:'',
				textMap:{
					update:'修改打印模板',
					created:'添加打印模板',
				},
				dialogFormVisible:false,

				temp:{
					sid:undefined,
					title:undefined,
					name:undefined,
					tpl:undefined,
			
				},
				rules:{
					sid:[{type:'integer'}],
					title:[{type:'string'}],
					name:[{required:true,type:'string'}],
					tpl:[{required:true}],
					
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
			this.listQuery.sid = this.$store.getters.session.sid
			this.getList()
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
				fetchPtrTplList(this.listQuery).then(response =>{
					console.log(this.$store.getters.session)
					this.list = response.data.list
					this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)
					this.shopOptions.push({id:0,name:'通用'})
					this.total = response.data.count
					this.listLoding = false

				})
				
			},
			resetTemp(){
				this.temp={
					sid:undefined,
					title:undefined,
					name:undefined,
					tpl:undefined,
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
				fetchPtrTpl(row.id).then(response=>{
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


			// getArea(sid){
			// 	fetchSRoomArea({sid}).then(response =>{
			// 		this.areaOptons = response.data.list
			// 	})
			// },

			createDate(){
				this.$refs['dataForm'].validate((valid) =>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						// tempData = this.remapData(tempData)
						createPtrTpl(tempData).then(()=>{
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
						// console.log(tempData)
						updatePtrTpl(tempData.id,tempData).then(() => {
					// for (const v of this.list) {
		            //   if (v.id === this.temp.id) {
		            //     const index = this.list.indexOf(v)
		            //     this.list.splice(index, 1, this.temp)
		            //     break
		            //   }
					// }
					this.getList()
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
