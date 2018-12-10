<template>
	<div class="app-container">
  
     	<div class="filter-container">
        <el-form  :inline="true" :model="searchForm">
          <el-form-item label="店铺">
              <el-select v-model="searchForm.sid" placeholder="选择店铺">
                  <el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="账号类型">
              <el-select v-model="searchForm.user_type" placeholder="选择类型">
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            <!-- <el-select clearable  style="width: 120px" v-model="listQuery.opType" placeholder="交易类型">
				<el-option v-for="item in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select> -->
          </el-form-item>
          <el-form-item label="工种类别">
              <el-select v-model="searchForm.jobType" placeholder="选择类别">
                  <el-option v-for="item in jtypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="工号">
              <el-input v-model="searchForm.rName" placeholder="姓名(工号)"></el-input>
          </el-form-item>
          <el-form-item label="登录名">
              <el-input v-model="searchForm.email" placeholder="登录名"></el-input>
          </el-form-item>
         <!-- <el-form-item label="角色ID">
              <el-input v-model="searchForm.roleID" placeholder=""></el-input>
         </el-form-item> -->
         <el-form-item>
               <el-button type="primary" @click="find()" plain>查询</el-button>
               <el-button class="bg-option"  @click="findReset()" plain>重置</el-button>
               <el-button type="success" @click="handleCreate()"> 新建 </el-button>
           </el-form-item>
     </el-form>
		</div>

		<el-table :key="tableKey" :data="tableData" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row style="width: 100%">

			<el-table-column align="center" label="登录账号">
				<template slot-scope="scope">
					<span>{{scope.row.email}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="员工工号">
				<template slot-scope="scope">
					<span>{{scope.row.rName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="员工姓名" >
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="所属店铺" >
				<template slot-scope="scope">
					<span>{{scope.row.shopName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="角色" >
				<template slot-scope="scope">
					<span>{{scope.row.roleExplain}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="登录信息" >
				<template slot-scope="scope">
					<span>{{scope.row.loginInfo}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" >
				<template slot-scope="scope">
					<span>{{scope.row.user_status | displayNameFilter(workStatuOptions)}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="400">
				<template slot-scope="scope">
                    <!-- <el-button class="bg-option" v-if="scope.row.user_type ===1" @click="handleUpdate(scope.row)"> 修改 </el-button> -->
                    <el-button type="success"  @click="handleUpdate(scope.row)"> 修改 </el-button>
					<el-button type="info" @click=""> 离职 </el-button>
					<el-button class="bg-option" @click=""> 删除 </el-button>
				</template>
			</el-table-column>
			
		</el-table>
		<!-- <div class="pagination-container">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="searchForm.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size.sync="pageTotal"></el-pagination>
		</div> -->
        <div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="searchForm.p"  
       layout="total, prev, pager,next, jumper" :total="total" :page-size.sync="pageTotal" ></el-pagination>
		</div>
        <!-- 修改和新建界面 -->
    <div id="newChangeUser">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px" style='margin-left:0px;'>
			 <el-form-item label="登录账号" prop="email">
			 	<el-input placeholder="输入员工登录账号" v-model='temp.email' :disabled="disable"></el-input>
			 </el-form-item>
			 <el-form-item label="密码" prop="password">
			 	<el-input  type="password" placeholder="输入密码" v-model='temp.password'></el-input>
			 </el-form-item>
			 <el-form-item v-if="!isSrv" label="员工工号" prop="rName">
			 	<el-input placeholder="输入员工工号" v-model='temp.rName'></el-input>
			 </el-form-item>
			 <el-form-item v-if="!isSrv" label="员工姓名" prop="name">
			 	<el-input placeholder="输入员工姓名" v-model='temp.name'></el-input>
			 </el-form-item>
			 <el-form-item v-if="isSrv" label="服务点名称" prop="rName">
			 	<el-input placeholder="输入员工姓名" v-model='temp.rName'></el-input>
			 </el-form-item>
             <template>
			 <el-form-item v-if="!isSrv" label="性别" prop="sex">
                <el-radio v-model="temp.sex" label="0" >未知</el-radio>
                <el-radio v-model="temp.sex" label="1" >男</el-radio>
                <el-radio v-model="temp.sex" label="2" >女</el-radio>
			 </el-form-item>
             </template>
			 <el-form-item v-if="!isSrv" label="联系电话" prop="phone">
			 	<el-input placeholder="输入联系电话" v-model='temp.phone'></el-input>
			 </el-form-item>
			 <el-form-item v-if="!isSrv" label="地址" prop="addr">
			 	<el-input placeholder="输入地址" v-model='temp.addr'></el-input>
			 </el-form-item>
              <el-form-item v-if="isSrv" label="服务点类型" prop="jobType">
			 	<el-select clearable v-model.number="temp.jobType" placeholder="选择服务点类型">
			 		<el-option v-for="item in stypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="所属店铺" required>
                <el-checkbox-group v-model="temp.sids" @change="getSRoomArea()">
                     <el-checkbox v-for="shop in shopOptions" :label="shop.id" :key="shop.id">{{shop.name+'('+shop.id+')'}}</el-checkbox>
                </el-checkbox-group>
			 </el-form-item>
			
			 <el-form-item v-if="!isSrv" label="楼层区域" required>
			 	<!-- <el-checkbox-group v-model="temp.areaId">
                     <el-checkbox v-for="area in AreaOptions" :label="area.id" :key="area.id">{{area.name+'(' + area.sid +')'}}</el-checkbox>
                </el-checkbox-group> -->
                <el-radio-group v-model="temp.areaId" required>
                    <el-radio v-for="area in AreaOptions" :label="area.id" >{{area.name+'(' + area.sid +')'}}</el-radio>
                </el-radio-group>
			 </el-form-item>
			 <el-form-item v-if="isSrv" label="楼层区域" required>
			 	<el-checkbox-group v-model="temp.areaId" @change="getWorkArea()">
                     <el-checkbox v-for="area in AreaOptions" :label="area.id" :key="area.id">{{area.name+'(' + area.sid +')'}}</el-checkbox>
                </el-checkbox-group>
			 </el-form-item>
			 <el-form-item v-if="isSrv" label="工作区" required>
			 	<el-checkbox-group v-model="temp.workAreaId">
                     <el-checkbox v-for="workArea in workAreaOptions" :label="workArea.id" :key="workArea.id">{{workArea.name}}</el-checkbox>
                </el-checkbox-group>
			 </el-form-item>
			 <el-form-item label="角色权限" required>
			 	<el-checkbox-group v-model="temp.role">
                     <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
                </el-checkbox-group>
			 </el-form-item>

			 <el-form-item v-if="!isSrv" label="职位/工种" required>
			 	<el-select clearable v-model.number="temp.jobType" placeholder="选择职位/工种">
			 		<el-option v-for="item in jtypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
             <el-form-item v-if="!isSrv" label="员工类型" prop="isAdmin">
                <el-radio v-model="temp.isAdmin" label="0">普通员工</el-radio>
                <el-radio v-model="temp.isAdmin" label="1">管 理 员</el-radio>
			 </el-form-item>
			</el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancel-button">取 消</el-button>
        <el-button class="submit-button" v-if="dialogStatus === 'createdStaff'" @click="createStaff()">新建员工账号</el-button>
        <el-button class="submit-button" v-if="dialogStatus === 'createdSrv'" @click="createStaff2()">新建服务账号</el-button>
        <el-button class="submit-button" v-if="dialogStatus === 'update'" @click="updateStaff()">更新员工账号</el-button>
        <el-button class="submit-button" v-if="dialogStatus === 'updateSrv'" @click="updateStaff2()">更新服务账号</el-button>
        </span>
        </el-dialog>
    </div>
    <!-- 选择界面 -->
    <div id="choose">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible1" width="80%" center> 
         <div style="text-align:center;"><span style="margin:auto;" class="mtext">{{chooseMessage}}</span></div><br>
        <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus === 'created'" @click="handleShowDialog1()" class="cancel-button">新建员工账号</el-button>
        <el-button v-if="dialogStatus === 'created'" class="submit-button" @click="handleShowDialog2()">新建服务账号</el-button>
        </span>
        </el-dialog>
    </div>
	</div>
	
    
</template>
<script >
	//引用路由方法 发送请求
    import { shopList} from '@/api/pay'
    import { fetchStaffList,createStaff,createStaff2,updateStaff, updateStaff2, getStaff, getStaff2 ,getSRoomArea,getWorkArea} from '@/api/user'
    import { displayShopFilter } from '@/filters'
    import {dict} from '@/store'

	export default{
		name: 'user-index',
		
		data(){
			return {
            searchForm: {
                p:1,
                user_type:undefined,
                rName:undefined,
                email:undefined,
                sid:undefined,
                roleID:undefined,
                jobType:undefined,
            },
            tableData: [],
            listLoding:false,
            tableKey:0,
            dialogFormVisible: false,
            dialogVisible1: false,
            roles: [],
            loading: false,
            current_page: 1,
            total: 0,
            pageTotal: 20,
            multiSelect: [],
            jtypeOptions:[],
            stypeOptions:[],
            typeOptions:[],
            shopOptions:[],
            workStatuOptions:[],
            AreaOptions:[],
            workAreaOptions:[],
            textMap:{
                    update:'修改员工账户信息',
                    updateSrv:'修改服务账户信息',
                    created:'新建用户',
                    createdStaff:'新建员工账户',
                    createdSrv:'新建服务账户',
                    },
            dialogStatus:'',
            temp:{
                email:undefined,
                password:undefined,
                name:undefined,
                rName:undefined,
                // email:undefined,
                sex:undefined,
                phone:undefined,
                addr:undefined,
                sids:[],
                role:[],
                jobType:[],
                isAdmin:undefined,
                areaId:[],
                workAreaId:[]
            },
            rules:{
                email:[{required: true,  fullField:'登录账号'}],
                password:[{required: true,  fullField:'登录密码'}],
                name:[{required: true,  fullField:'员工姓名'}],
                rName:[{required: true,  fullField:'员工工号'}],
                sex:[{required: true, type: 'integer', fullField:'性别'}],
                sids:[{ type: 'array', required: true, message: '请至少选择一个店铺'}],
                role:[{required: true, type: 'array', message: '请至少选择一个角色'}],
                areaId:[{required: true, type: 'array', message: '请至少选择一个楼层'}],
                workAreaId:[{required: true, type: 'array', message: '请至少选择一个工作区域' }],
                jobType:[{required: true, type: 'integer', fullField:'职位'}],
                isAdmin:[{required: true, type: 'integer', fullField:'员工类型'}],
            },
            roleList:[],
            checkAllRole:false,
            isIndeterminateR:true,
            checkAllSid:false,
            isIndeterminateSid:true,
            title:undefined,
            chooseMessage:undefined,
            isSrv:false,
            disable:true,
             
            
        }
		},
		filters:{

		},
		created(){
			dict('jobType').then(response => {
            this.jtypeOptions = response
            })
			dict('srvType').then(response => {
            this.stypeOptions = response
            })
			dict('workStatus').then(response => {
            this.workStatuOptions = response
            })
			dict('roleName',1).then(response => {
            this.roleList = response
            console.log(this.roleList)
            })
            shopList().then(response => {
            // this.shopOptions = response.data.list
            this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.list)
            })
            this.typeOptions.push({id:1,name:'员工'},{id:2,name:'服务台'})
			this.getList()
			
		},
		computed:{},
		watch:{},
		methods:{
            // handleCheckAllChangeSid(val){
            //     this.temp.sids = val ? [1,2] : [];
            //     this.isIndeterminateSid = false;
            // },
            //  handleCheckedCitiesChangeSid(value) {
            //     let checkedCount = value.length;
            //     this.checkAllSid = checkedCount === this.shopOptions.length;
            //     this.isIndeterminateSid = checkedCount > 0 && checkedCount < this.shopOptions.length;
            // },
            //  isInArray(arr,value){
            // if(arr.indexOf&&typeof(arr.indexOf)=='function'){
            //     var index = arr.indexOf(value);
            //     if(index >= 0){
            //         return true;
            //     }
            // }
            // return false;
            // },
          
			getList(){
                this.listLoding = true
                
				fetchStaffList(this.searchForm).then(response =>{
                    this.tableData = response.data.list
                    // var id = this.searchForm.sid+''
                    // this.tableData = response.data.list.map((row) => {
                    //     var ids = row.sids.sqlist(',')
                    //     console.log(id)
                    //     console.log(ids)
                    //     if(this.isInArray(ids,id)){
                    //      return  row
                    //     }
                    // })
                    
                    this.total = response.data.count
                    // this.pageTotal = response.data.list.length
					this.listLoding = false
				})
				
            },
            findReset(){
                this.searchForm ={
                    p:1,
                    user_type:undefined,
                    rName:undefined,
                    email:undefined,
                    sid:undefined,
                    roleID:undefined,
                    jobType:undefined,}
            },
            restUser(){
                this.temp ={
                    email:undefined,
                    password:undefined,
                    name:undefined,
                    rName:undefined,
                    sex:0,
                    phone:undefined,
                    addr:undefined,
                    sids:[],
                    role:[],
                    jobType:[],
                    isAdmin:undefined,
                    areaId:[],
                    workAreaId:[]
                }
            },
            
            find(){
                this.getList()
            },
            
			handleFilter(){
				this.searchForm.p = 1
				this.getList()
			},
             handleSizeChange(val) {
                this.searchForm.limit = val
                this.getList()
            },
			handleCurrentChange(val){
				this.searchForm.p = val
				this.getList()
            },
            handleCreate(){
                this.dialogStatus = 'created'
                this.dialogVisible1 = true
                this.chooseMessage = '请选择你新建账号的类型'
            },
            handleShowDialog1(){
                this.workAreaOptions=[]
                this.AreaOptions=[]
                this.dialogVisible1 = false
                this.dialogStatus = 'createdStaff'
                this.restUser()
                this.isSrv = false
                this.disable = false
                this.dialogFormVisible = true
            },
            handleShowDialog2(){
                this.workAreaOptions=[]
                this.AreaOptions=[]
                this.dialogVisible1 = false
                this.dialogStatus = 'createdSrv'
                this.restUser()
                this.isSrv = true
                this.disable = false
                this.dialogFormVisible = true
            },
            handleUpdate(row){
                this.restUser()
                this.disable = true
                if(row.user_type ===1){
                    this.isSrv = false
                    this.dialogStatus = 'update'
                    getStaff(row.id).then(response =>{
                        this.temp = response.data
                         getSRoomArea({sid:this.temp.sids}).then(response => {
                            this.AreaOptions = response.data.list
                        })
                        this.temp.sids = this.temp.sids !=null ? this.temp.sids.split(',').map(function(data){  return +data;   }):[];
                        this.temp.areaId = this.temp.areaId*1 
                        this.temp.role = this.temp.role !=null ? this.temp.role.split(','):[]
                        // console.log(this.temp)
                        this.temp.sex = this.temp.sex.toString()
                        this.temp.isAdmin = this.temp.isAdmin.toString()
                        if(typeof this.temp.password =="undefined"){
                            this.temp.password = '000000'
                        }
                    this.dialogFormVisible = true
                    })
                        console.log(this.temp)
                        console.log(this.AreaOptions)
                }else{
                    this.isSrv = true
                    this.dialogStatus = 'updateSrv'
                     getStaff2(row.id).then(response =>{
                        this.temp = response.data

                        getSRoomArea({sid:this.temp.sids}).then(response => {
                            this.AreaOptions = response.data.list
                        })
                        getWorkArea({sid:this.temp.sid,pid:this.temp.areaId}).then(response => {
                            this.workAreaOptions = response.data.list
                        })

                        this.temp.sids = this.temp.sids.split(',').map(function(data){  return +data;   });
                        this.temp.role = this.temp.role.split(',')
                        this.temp.areaId = this.temp.areaId.split(',').map(function(data){  return +data;   });
                        this.temp.workAreaId = this.temp.workAreaId.split(',').map(function(data){  return +data;   });
                       if(typeof this.temp.password =="undefined"){
                           this.temp.password = '000000'
                        }
                        console.log(this.temp)
                    this.dialogFormVisible = true
                    })
                }
                // this.temp = row
                // this.dialogFormVisible = true
            },
            displayNameFilter(id, options) {
      		const finded = options.find((option) => option.id === id)
      		if (finded) {
        		return finded.name
      			}
            },
            getSRoomArea(){
                const sID = this.temp.sids.join(',')
            getSRoomArea({sid:sID}).then(response => {
                this.AreaOptions = response.data.list
            })
            },
            getWorkArea(){
                const upID = this.temp.areaId.join(',')
                const sID = this.temp.sids.join(',')
            getWorkArea({sid:sID,upid:upID}).then(response => {
                this.workAreaOptions = response.data.list
            })
            },
            createStaff(){
                const tempData = Object.assign({},this.temp)
                tempData.sids = tempData.sids.join(',')
                tempData.role = tempData.role.join(',')
                // tempData.areaId = tempData.areaId != [] ?tempData.areaId.join(','):''

               createStaff(tempData).then(response => {
                   this.dialogFormVisible = false
                   this.$notify({
                       title:'新建员工账号',
                       message:response.msg,
                       type:response.code ===200?'success' : 'denger'
                   })
                   this.getList()
               }) 
            },
            createStaff2(){
                const tempData = Object.assign({},this.temp)
                 tempData.sids = tempData.sids.join(',')
                tempData.role = tempData.role.join(',')
                tempData.areaId = tempData.areaId.join(',')
                tempData.workAreaId = tempData.workAreaId.join(',')
               createStaff2(tempData).then(response => {
                   this.dialogFormVisible = false
                   this.$notify({
                       title:'新建服务账号',
                       message:response.msg,
                       type:response.code ===200?'success' : 'denger'
                   })
                   this.getList()
               }) 

            },
            updateStaff(){
                const tempData = Object.assign({},this.temp)
                tempData.sids = tempData.sids.join(',') 
                tempData.role = tempData.role.join(',')
                //  tempData.areaId = tempData.areaId != [] ?tempData.areaId.join(','):''
                if(this.temp.password == '000000'){
                    tempData.password = undefined
                }
                console.log(tempData)

               updateStaff(tempData.id,tempData).then(response => {
                   this.getList()
                   this.dialogFormVisible = false
                   this.$notify({
                       title:'更新员工账号',
                       message:response.msg,
                       type:response.code ===200?'success' : 'denger'
                   })
               }) 
            },
            updateStaff2(){
                const tempData = Object.assign({},this.temp)
                 tempData.sids = tempData.sids.join(',')
                tempData.role = tempData.role.join(',')
                tempData.areaId = tempData.areaId.join(',')
                tempData.workAreaId = tempData.workAreaId.join(',')
                 if(this.temp.password == '000000'){
                     tempData.password = undefined
                }
                console.log(tempData)

               updateStaff2(tempData.id,tempData).then(response => {
                   this.getList()
                   this.dialogFormVisible = false
                   this.$notify({
                       title:'更新服务账号',
                       message:response.msg,
                       type:response.code ===200?'success' : 'denger'
                   })
               }) 

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
.el-radio__label{

  line-height: 1.5rem;
}
.el-radio__inner{
    background: #F4DDDA
}
.el-checkbox__inner{
    background: #F4DDDA
}
</style>

