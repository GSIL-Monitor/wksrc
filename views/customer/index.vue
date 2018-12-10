<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sid" :placeholder="$t('customer.sid')">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>
			<el-select clearable class="filter-item" style="width: 120px" v-model="listQuery.level" :placeholder="$t('customer.level')">
				<el-option v-for="item in levelOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
			</el-select>

			<el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" :placeholder="$t('customer.phone')" v-model="listQuery.phone"></el-input>
			<el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" :placeholder="$t('customer.name')" v-model="listQuery.name"></el-input>
			<el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="顾客ID/会员卡ID" v-model="listQuery.vid"></el-input>
			<el-button class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" icon="el-icon-edit">{{$t('table.add')}}</el-button>
        	<el-button type="danger" class="filter-item" >
        	<router-link :to="'/customer/moneyLog/'+0">
             余额记录
            </router-link>
        	</el-button>
		</div>
<!-- ************************************************************************************************************************************* -->
		<el-table :key="tableKey" :data="list" v-loading="listLoding" element-loading-text="稍等片刻" border fit highlight-current-row >
			<el-table-column align="center" label="顾客ID" >
				<template slot-scope="scope">
					<span>{{scope.row.vid}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="会员卡编号" >
				<template slot-scope="scope">
					<span>{{scope.row.cNo}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="顾客名称">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="性别" >
				<template slot-scope="scope">
					<span>{{sexStr[scope.row.sex]}}</span>
				</template>
			</el-table-column>
			
			<el-table-column align="center" label="账户余额">
				<template slot-scope="scope">
					<span>{{scope.row.leftFund}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="消费情况" min-width="150">
				<template slot-scope="scope">
					<span>消费次数:{{scope.row.orderNum}}, 总消费:{{scope.row.sumCFund}},可开发票:{{scope.row.invoiceAmount}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="等级" >
				<template slot-scope="scope">
					<!-- <span v-for='item in levelOptions'>
						<span v-if = "item.id == scope.row.level">
							{{item.name}} 
						</span>
					</span> -->
					<span>{{scope.row.level | displayNameFilter(levelOptions)}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="关注时间">
				<template slot-scope="scope">
					<span>{{scope.row.createDT}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="电话" min-width="110">
				<template slot-scope="scope">
					<span>{{scope.row.phone}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="生日" >
				<template slot-scope="scope">
					<span>{{scope.row.birthday}}</span>
				</template>
			</el-table-column>
			<el-table-column align="right" label="操作" min-width="290">
      		<template slot-scope="scope">
      			<div>
					<span v-if="scope.row.isDel == 0">
      				<el-dropdown>
        		<el-button type="primary" size="small" split-button="true">
        			顾客操作<i class="el-icon-arrow-down el-icon--right"></i>
        			</el-button>
        			<el-dropdown-menu slot="dropdown">
        				<el-dropdown-item  @click.native='handleUpdate(scope.row)'>修改资料</el-dropdown-item>
        				<el-dropdown-item  @click.native='handleMergeID(scope.row)'>顾客ID合并</el-dropdown-item>
        				<el-dropdown-item  @click.native='handleChangeLevel(scope.row)'>等级变更</el-dropdown-item>
        				<el-dropdown-item  @click.native='handleDelete(scope.row.id)'>账户作废</el-dropdown-item>
						<router-link :to="'/customer/address/'+scope.row.id">
        				<el-dropdown-item >管理地址</el-dropdown-item>
						</router-link>
        			</el-dropdown-menu>
        	</el-dropdown>
        	<el-button v-if="scope.row.level == 0" type="danger" size="small" @click='hendleOpen(scope.row)'>开通会员</el-button>
        	<el-dropdown v-else>
        		<el-button type="primary" size="small">
        			会员操作<i class="el-icon-arrow-down el-icon--right"></i>
        			</el-button>
        			<el-dropdown-menu slot="dropdown">
        				<el-dropdown-item @click.native='hendleDeposit(scope.row)'>会员充值</el-dropdown-item>
        				<el-dropdown-item @click.native='hendleRefund(scope.row)'>会员退款</el-dropdown-item>
        				<el-dropdown-item @click.native='hendleInvoice(scope.row)'>开发票</el-dropdown-item>
        			</el-dropdown-menu>        		
        	</el-dropdown>
      			</span>
      	
			<el-button v-if="scope.row.isDel >0 " type="success" size="small" @click='handleRestore(scope.row.id)'>恢复账号</el-button>
        	<router-link :to="'/customer/moneyLog/'+scope.row.id">
        	<el-button type="danger" size="small">
             余额记录
        	</el-button>
            </router-link>
			</div>
      		</template>
    		</el-table-column>
			
		</el-table>
		<div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total=total></el-pagination>
		</div>
<!-- ************************************************************************************************************************************ -->	
		<!-- 新建和修改界面 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px"
 style='margin-left:0px;'>
			 <el-form-item label="顾客名称" prop="name">
			 	<el-input placeholder="输入顾客名称" v-model='temp.name'></el-input>
			 </el-form-item>

			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="temp.sid" placeholder="选择店铺">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="性别" prop="sex">
			 	<el-select v-model.number="temp.sex" placeholder="选择性别" >
			 		<el-option v-for="item in sexOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="联系电话" prop="phone">
			 	<el-input placeholder="输入工作区(岗位)" v-model='temp.phone'></el-input>
			 </el-form-item>
			 <el-form-item label="会员编号" prop="cNo">
			 	<el-input placeholder="会员编号" v-model='temp.cNo'></el-input>
			 </el-form-item>
			 <el-form-item label="实体卡信息" prop="CUID">
			 	<el-input placeholder="用读卡器读出会员卡的信息" v-model='temp.CUID'></el-input>
			 </el-form-item>
			 <el-form-item label="备注" prop="remark">
			 	<el-input placeholder="备注" v-model.number='temp.remark'></el-input>
			 </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus == 'created'" type="primary" @click="createDate">{{$t('table.confirm')}}</el-button>
				<el-button v-else-if="dialogStatus == 'update'" type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
			</div>
		</el-dialog>
	<!-- *********************************************************************************************************************************** -->
		<!-- 客户id合并 和 等级更变 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1">
			<el-form ref="dataForm1" :model="temps" label-position="right" label-width="150px" style='margin-left:0px;'>
			<div>
			<div v-if="dialogStatus == 'merge'">
			 <el-form-item label="当 前 VID :" >
			 	{{this.vid}}
			 </el-form-item>

			 <el-form-item label=" 合并的目标ID :" >
			 	<!-- <el-input placeholder="旧的ID"  v-model='mergeID'></el-input> -->
				  <!-- <el-form-item label="合并的目标ID" > -->
                <el-input placeholder="合并之后ID或者卡号" v-if="VisibleInput2" v-model.number='mergeID' @focus="hidd2"></el-input>
			 	<el-autocomplete v-if="VisibleSelect2" style="width:100%;"  :fetch-suggestions="querySearchAsync2" placeholder="合并之后ID或者卡号" @select="handleSelect2" :disabled="!VisibleButton"></el-autocomplete>
			 	<span style="color: #F56C6C">提示：如果当前账号是 <em style="color:#409EFF">会员</em> 和 <em style="color:#409EFF" >有余额</em>  或者不是  <em style="color:#409EFF">微信账号</em>，都无法合并</span>
			 </el-form-item>
			 
			 <el-form-item label="目标名称 :">
			 	{{this.name}}
			 </el-form-item>
			 <el-form-item label="目标电话 :">
			 	{{this.phone}}
			 </el-form-item>
			 <el-form-item label="目标余额 :">
			 	{{this.leftFund}}
			 </el-form-item>	
			 </div>
			 <div v-if="dialogStatus == 'level'">
				 <el-form-item label="顾客名称 :">
					{{this.name}}
				</el-form-item>
				<el-form-item label="联系电话 :">
					{{this.phone}}
				</el-form-item>
			 	<div v-for='item in levelOptions'>
			 		<el-form-item  v-if = "item.id == temps.level" label="目前等级" prop="level">
			 		<span style="color:#F56C6C;">{{item.name}}</span>
			 		</el-form-item>
			 	</div>
			 
			 <el-form-item label="更变等级" prop="id">
			 	<el-select clearable class="filter-item" style="width: 120px" v-model="level" :placeholder="$t('customer.level')">
				<el-option v-for="item in levelOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
				</el-select>
			 </el-form-item>
			 </div>
			</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus == 'merge'" type="primary" @click="mergeCustomerID">{{$t('table.confirm')}}</el-button>
				<el-button v-else-if="dialogStatus == 'level'"  type="primary" @click="changeCLevel">{{$t('table.confirm')}}</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
				<div class="demo-input-suffix"  v-if="dialogStatus == 'isDel'"> 作废注释：<el-input placeholder="请输入作废原因" prefix-icon="el-icon-edit" v-model="remark"></el-input>
				</div>
				<div class="demo-input-suffix" v-else> 恢复注释：<el-input placeholder="请输入恢复原因" prefix-icon="el-icon-edit" v-model="remark"></el-input>
				</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">{{$t('table.cancel')}}</el-button>
				<el-button type="danger" @click="customerDel"  v-if="dialogStatus == 'isDel'">确认作废</el-button>
				<el-button type="danger" @click="customerRestore"  v-if="dialogStatus == 'restore'">确认恢复</el-button>
			</div>
		</el-dialog>
		<!-- *************************************************************************************************************************** -->
		<!-- 会员充值和退款 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible3">
			<el-form  :rules="rules2" ref="dataForm2" :model="mtopup" label-position="right" label-width="150px" style='margin-left:0px;'>
			 <el-form-item label="顾客名称 :" prop="name">
			 	<el-input placeholder="顾客名称"  v-model='mtopup.name'></el-input>
			 	<!-- {{this.name}} -->
			 </el-form-item>
			 <el-form-item label="联系电话 :" prop="phone">
			 	<el-input placeholder="联系电话" v-model='mtopup.phone'></el-input>
			 	<!-- {{this.phone}} -->
			 </el-form-item>
			 
			 <!---->

			 <div v-if="dialogStatus == 'topup'">
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="mtopup.sid" placeholder="选择店铺" disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="支付方式" prop="payType">
			 	<el-select clearable v-model="mtopup.payType" placeholder="选择支付方式">
			 		<el-option v-for="item in payTypeOtions" v-if="item.id != 20" :key="item.id" :label="item.name" :value="item.id" ></el-option>
			 	</el-select>
			 </el-form-item>
			 
			 <el-form-item label="充值金额 :" prop="fee">
			 	<el-input placeholder="输入充值金额" v-model.number='mtopup.fee'></el-input>
			 	<span style="color:  #F56C6C">充值赠送金额为整数</span>
			 </el-form-item>
			 <!-- <el-form-item label="赠送金额 :" prop="giftFund">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='mtopup.giftFund'></el-input>
			 </el-form-item> -->
			<el-form-item label="是否开票">
			 	<el-select  v-model="gift">
			 		<el-option label="不需要发票" value="0"></el-option>
			 		<el-option label="需要发票" value="1"></el-option>
			 	</el-select> 
			 </el-form-item>

			 <el-form-item label="赠送金额(发票)" prop="giftFund2" v-if="gift == 1">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='mtopup.giftFund2'></el-input>
			 </el-form-item>
			 <el-form-item label="赠送金额" prop="giftFund" v-if="gift == 0">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='mtopup.giftFund'></el-input>
			 </el-form-item>
			 <el-form-item label="赠送服务费 :" prop="giftFundSrv">
			 	<el-input placeholder="(选填)赠送服务费" v-model.number='mtopup.giftFundSrv'></el-input>
			 </el-form-item>
			 <el-form-item label="业绩所属员工 :" prop="staffID">
			 	<el-input placeholder="(选填)员工工号" v-model.number='mtopup.staffID'></el-input>
			 </el-form-item>
			 </div>

			 <div v-if="dialogStatus == 'open'">
			 <el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="mtopup.sid" placeholder="选择店铺" disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="支付方式" prop="payType">
			 	<el-select clearable v-model="mtopup.payType" placeholder="选择支付方式">
			 		<el-option v-for="item in payTypeOtions" :key="item.id" :label="item.name" :value="item.id" v-if="item.id != 20"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="会员等级">
			 	<el-select clearable v-model="mtopup.openLevel" placeholder="选择开通的等级">
			 		<el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="开通金额 :" prop="fee">
			 	<el-input placeholder="输入开通金额" v-model.number='mtopup.fee'></el-input>
			 </el-form-item>
			<el-form-item label="是否开票">
			 	<el-select  v-model="gift">
			 		<el-option label="不需要发票" value="0"></el-option>
			 		<el-option label="需要发票" value="1"></el-option>
			 	</el-select> 
			 </el-form-item>

			 <el-form-item label="赠送金额(发票)" prop="giftFund2" v-if="gift == 1">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='mtopup.giftFund2'></el-input>
			 </el-form-item>
			 <el-form-item label="赠送金额" prop="giftFund" v-if="gift == 0">
			 	<el-input placeholder="(选填)输入赠送金额" v-model.number='mtopup.giftFund'></el-input>
			 </el-form-item>
			 <el-form-item label="业绩所属员工 :" prop="staffID">
			 	<el-input placeholder="(选填)员工工号" v-model.number='mtopup.staffID'></el-input>
			 </el-form-item>
			 </div>

			 <div v-else-if="dialogStatus == 'refund'">
			 	<el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="mtopup.sid" placeholder="选择店铺" @change=getLeftFund  disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 	<span style="color: #F56C6C">顾客在当前店铺余额：{{this.leftFund}}</span>
			 </el-form-item>
			 <el-form-item label="支付方式" prop="payType"> 
			 	<el-select clearable v-model="mtopup.payType" placeholder="选择支付方式">
			 		<el-option v-for="item in payTypeOtions" :key="item.id" :label="item.name" :value="item.id" v-if="item.id == 1 || item.id == 6"></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="退款金额 :" prop="rfee">
			 	<el-input placeholder="输入退款金额" v-model.number='mtopup.fee' @input="showt"></el-input>
			 	<span style="color: #F56C6C" v-if="isdisable">输入的退款金额过大</span>
			 	<span style="color: #F56C6C" v-if="isdisable2">输入的整数</span>
			 </el-form-item>
			 <el-form-item label="退款备注 :" prop="giftFund">
			 	<el-input placeholder="退款备注" v-model='mtopup.remark' type="textarea"  :autosize="{ minRows:3,maxRows:6}"></el-input>
			 </el-form-item>
			 </div>
			 <div v-else-if="dialogStatus == 'invoice'">
			 	<el-form-item label="所属店铺" prop="sid">
			 	<el-select clearable v-model="mtopup.sid" placeholder="选择店铺" @change=getLeftFund  disabled>
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			 	<span style="color: #F56C6C">顾客在当前店铺发票余额：{{this.leftFund}}</span>
			 </el-form-item>
			 <el-form-item label="选择发票资料" > 
			 	<el-select clearable v-model="mtopup.addrId" placeholder="选择地址">
			 		<el-option v-for="item in addrOtions" :key="item.id" :label="item.name + '(' + item.address +')'" :value="item.id" ></el-option>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="开票金额 :" prop="fee">
			 	<el-input placeholder="开票金额" v-model.number='mtopup.fee' @input="showt"></el-input>
			 	<span style="color: #F56C6C" v-if="isdisable">输入的退款金额过大</span>
			 	<span style="color: #F56C6C" v-if="isdisable2">输入的整数</span>
			 </el-form-item>
			 <el-form-item label="发票号 :">
			 	<el-input placeholder="发票号" v-model='mtopup.head'></el-input>
			 </el-form-item>
			 </div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible3 = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus == 'topup'" type="primary" @click="deposit">确认充值</el-button>
				<el-button v-if="dialogStatus == 'refund'" :disabled="isdisable" type="primary" @click="aRefund">退款</el-button>
				<el-button v-if="dialogStatus == 'open'"  type="primary" @click="deposit">开通会员</el-button>
				<el-button v-if="dialogStatus == 'invoice'"  type="primary" @click="ChargeInvoices">开发票</el-button>
			</div>
		</el-dialog>

	</div>

</template>
<script >
	//引用路由方法 发送请求
	import { fetchCustomerList, fetchGetCustomer , AddList, ChargeInvoices} from '@/api/customer'
	import {createCustomer, updateCustomer, mergeCustomerID, changeCLevel, customerDel, deposit, aRefund,getLeftFund,customerRestore} from '@/api/customer'

    import { displayShopFilter } from '@/filters'
	import waves from '@/directive/waves' 
	import {parseTime} from '@/utils'
	import { dict} from '@/store'

	export default{
		name: 'print-index',
		directories:{
			waves
		},

		data(){
			var checkFee =(rule,value,callback)=>{
					if (!value) {return callback(new Error('充值金额不能为空'));}
					setTimeout(()=>{
						if (!Number.isInteger(value)) {
							callback(new Error('请输入整数金额'));
						}else{
							// if (value%10 !=0) {
							// 	callback(new Error("输入金额需为整十"));
							// }else{
								callback();
							// }
						}
					}, 1000);
				};
			var checkCUID =(rule,value,callback)=>{
					if(value.length ==10 || value.length ==0){
						callback();
					}else{
						callback(new Error('IC信息必须是10位数'));
					}
				};
	var isMobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    var checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号码不能为空'));
        } else {
          if (!(isMobile.test(value))) {
            callback(new Error('手机号码格式有误(11位)'));
          }
          callback();
        }
      };
			return {
				shopOptions:[],
				typeOptions:[{id:1,name:"是"},{id:0,name:"否"}],
				typestr:{0:'否',1:'是'},
				levelOptions:[],
				levelStr:{},
				sexOptions:[{id:0,name:"男"},{id:1,name:"女"},{id:3,name:"未知"}],
				sexStr:{0:'男',1:'女',3:'未知'},
				listQuery:{
					p: 1,
					name: undefined,
					sid: undefined,
					level:undefined,
					phone:undefined,
					vid:undefined,
				},
				tableKey:0,
				list:null,
				listLoding:true,
				total: null,
				dialogStatus:'',
				textMap:{
					update:'修改顾客信息',
					created:'添加顾客',
					merge:'顾客ID合并',
					level:'顾客等级更变',
					isDel:'是否作废此顾客账户',
					restore:'恢复账号',
					open:'开通会员',
					topup:'会员充值',
					refund:'会员退款',
					invoice:'开发票',
				},
				dialogFormVisible:false,
				dialogFormVisible1:false,
				dialogFormVisible2:false,
				dialogFormVisible3:false,

				temp:{
					id:undefined,
					name: undefined,
					sid: undefined,
					sex: undefined,
					phone:undefined,
					cNo:undefined,
					CUID:undefined,
				},
				rules:{
					// sid:[{required:true,type:'integer'}],
					// phone:[{required:true,type:'string'}],
					// name:[{required:true,type:'string'}],
					sex:[{type:'integer'}],
					cNo:[{type:'string'}],
					CUID: [{ validator: checkCUID}],
					
				},

				areaOptons:[],

				temps:[],
				id:undefined,
				vid:undefined,
				mergeID:undefined,
				level:undefined,
				remark:undefined,
				cid:undefined,
				leftFund:null,
				name:undefined,
				phone:undefined,

				payTypeOtions:[],
				// payTypeOtions:[{id:0,name:'微信支付'},{id:1,name:'现金'},{id:2,name:'刷卡'},{id:20,name:'支付宝'},{id:3,name:'挂账'},{id:4,name:'公司招待'}],
				
				mtopup:{
					cid:undefined,
					sid:undefined,
					name:undefined,
					phone:undefined,
					staffID:undefined,
					payType:undefined,
					fee:undefined,
					// rfee:undefined,
					giftFund:undefined,
					giftFund2:undefined,
					giftFundSrv:undefined,
					remark:undefined,
					openLevel:undefined,

					head:undefined,
					addrId:undefined,
					// cpid:undefined,
					// cpNum:undefined,
				},
				rules2:{
					fee:[{validator:checkFee}],
					giftFund:[{type:'number',message: '类型必须数数字'}],
					giftFundSrv:[{type:'number',message: '类型必须数数字'}],
					rfee:[{type:'number',message: '类型必须数数字'}],
					payType:[{required:true,message: '支付类型必须选择'}],
					// sid:[{required:true}],
					name:[{required:true}],
					phone: [{ validator: checkPhone}],
				},
				isdisable:false,
				isdisable2:false,
				gift:"0",
				VisibleSelect2: true,
				VisibleInput2: false,
				VisibleButton: true,
				addrOtions:[],

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
			dict('payType',0,0,0).then(response=>{
				this.payTypeOtions = response
			})
			this.getList()
			
		},
		computed:{},
		watch:{},
		methods:{
			getList(){
				this.listLoding = true
				fetchCustomerList(this.listQuery).then(response =>{
					this.list = response.data.list
					// this.shopOptions = response.data.shopList
					this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)

					this.total = response.data.count
					this.listLoding = false
				})
				
			
			},
		
			resetTemp(){
				this.temp={
					id:undefined,
					name: undefined,
					sid: undefined,
					sex: undefined,
					phone:undefined,
					cNo:undefined,
					CUID:undefined,
				}
			},
			resetMtopup(){
				this.mtopup={
					cid:undefined,
					sid:undefined,
					name:undefined,
					phone:undefined,
					staffID:undefined,
					payType:undefined,
					fee:undefined,
					giftFund:undefined,
					giftFund2:undefined,
					giftFundSrv:undefined,
					remark:undefined,
					openLevel:undefined,
					// cpid:undefined,
					// cpNum:undefined,
					head:undefined,
					addrId:undefined,
				}
				this.isdisable = false
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
				fetchGetCustomer(row.id).then(response=>{
				this.temp = response.data
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(()=>{
				this.$refs['dataForm'].clearValidate()
				})
				})
			},
			handleMergeID(row){
				this.mergeID =undefined
				this.temps =row
				this.id = row.id
				this.vid = row.vid
				// this.name = row.name
				// this.phone = row.phone
				// this.leftFund = row.leftFund
				this.dialogStatus = 'merge'
				this.dialogFormVisible1 = true
				this.$nextTick(()=>{
				this.$refs['dataForm1'].clearValidate()
				})
			},
			handleChangeLevel(row){
				this.level =undefined
				this.resetMtopup()
				this.temps = row

				this.id = row.id
				this.vid = row.vid
				this.name = row.name
				this.phone = row.phone
				this.dialogStatus = 'level'
				this.dialogFormVisible1 = true
				this.$nextTick(()=>{
				this.$refs['dataForm1'].clearValidate()
				})
			},
			handleDelete(id){
				this.id = id
				this.dialogStatus = 'isDel'
				this.dialogFormVisible2 = true
			},
			handleRestore(id){
				this.id = id
				this.dialogStatus = 'restore'
				this.dialogFormVisible2 = true
			},
			hendleDeposit(row){
				this.resetMtopup()
				this.mtopup.name = row.name
				this.mtopup.phone = row.phone
				this.mtopup.sid = row.sid
				this.mtopup.cid = row.id
				this.dialogStatus = 'topup'
				this.dialogFormVisible3 = true
				this.$nextTick(()=>{
				this.$refs['dataForm2'].clearValidate()
				})
			},
			hendleOpen(row){
				this.resetMtopup()
				this.mtopup.name = row.name
				this.mtopup.phone = row.phone
				this.mtopup.sid = row.sid
				this.mtopup.cid = row.id
				this.dialogStatus = 'open'
				this.dialogFormVisible3 = true
				this.$nextTick(()=>{
				this.$refs['dataForm2'].clearValidate()
				})
			},
			hendleRefund(row){
				this.resetMtopup()
				this.mtopup.name = row.name
				this.mtopup.phone = row.phone
				this.mtopup.sid = row.sid
				this.mtopup.cid = row.id
				this.dialogStatus = 'refund'
				this.getLeftFund()
				this.dialogFormVisible3 = true
				this.$nextTick(()=>{
				this.$refs['dataForm2'].clearValidate()
				})
			},
			hendleInvoice(row){
				this.resetMtopup()
				this.mtopup.name = row.name
				this.mtopup.phone = row.phone
				this.mtopup.sid = row.sid
				this.mtopup.cid = row.id
				this.dialogStatus = 'invoice'
				this.leftFund = row.invoiceAmount//发票金额
				this.dialogFormVisible3 = true
				AddList({cid:this.mtopup.cid,invoice:1}).then(response => {
					this.addrOtions = response.data.list
				})
				this.$nextTick(()=>{
				this.$refs['dataForm2'].clearValidate()
				})
			},
			ChargeInvoices(){
				ChargeInvoices(this.mtopup.cid,{fee:this.mtopup.fee,head:this.mtopup.head,addrId:this.mtopup.addrId}).then(response => {
					this.$notify({
						title: '开票',
			              message: response.msg,
			              type: 'success',
			              duration: 2000
				})
					this.dialogFormVisible3 =false
				})
			},
			handleCurrentChange(val){
				this.listQuery.p = val
				this.getList()
			},


			createDate(){
				this.$refs['dataForm'].validate((valid) =>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						// tempData = this.remapData(tempData)
						createCustomer(tempData).then(()=>{
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
						updateCustomer(tempData.id,tempData).then(() => {
		              this.dialogFormVisible = false
		              this.getList()
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
			getLeftFund(){
				this.leftFund = 0
				getLeftFund({'cid':this.mtopup.cid,'sid':this.mtopup.sid}).then(response=>{
					this.leftFund = response.data[0].leftFund
				})
			},
			// components
			// goMoneyLog(){
			// 	this.$router.push({path: '/components/MoneyLog.vue',query:{ cid:this.cid}});
			// },
            mergeCustomerID(){
            	mergeCustomerID(this.id,{'vid':this.mergeID}).then(()=>{
            		this.dialogFormVisible1 = false
            		this.getList()
            			this.$notify({
			              title: '成功',
			              message: response.msg,
			              type: 'success',
			              duration: 2000
			            })
            	})
            	

			},
			changeCLevel(){
				changeCLevel(this.id,{'ncLevel':this.level}).then(response=>{
					this.dialogFormVisible1 = false 
					this.getList()
					this.$notify({
			              title: '等级更变成功',
			              message: response.msg,
			              type: 'success',
			              duration: 2000
			            })
            
				})

			},
			customerDel(){
				customerDel(this.id,{'remark':this.remark}).then(()=>{
					this.dialogFormVisible2 = false 
					this.getList()
					this.$notify({
			              title: '成功',
			              message: '作废成功',
			              type: 'success',
			              duration: 2000
			            })
				})
			},
			customerRestore(){
				customerRestore(this.id,{'remark':this.remark}).then(()=>{
					this.dialogFormVisible2 = false 
					this.getList()
					this.$notify({
			              title: '成功',
			              message: '恢复成功',
			              type: 'success',
			              duration: 2000
			            })
				})
			},
			deposit(){
				this.$refs['dataForm2'].validate((valid)=>{
					if (valid) {
						let tempData = Object.assign({},this.mtopup)
						if(this.gift == "0"){
							tempData.giftFund2 = undefined
						}else if(this.gift == "1"){
							tempData.giftFund = undefined
						}
						deposit(tempData).then(response=>{
							this.dialogFormVisible3 =false
							this.getList()
							this.$notify({
			              title: '成功',
			              message: response.msg,
			              type: 'success',
			              duration: 2000
			            })
						})
					}
				})
			},
			aRefund(){
				this.$refs['dataForm2'].validate((valid)=>{
					if (valid) {
						let tempData = Object.assign({},this.mtopup)
						aRefund(tempData).then(response=>{
							this.dialogFormVisible3 =false
							this.getList()
								this.$notify({
			              title: '退款操作成功',
			              message: response.msg,
			              type: 'success',
			              duration: 2000
			            })
						})
					}
				})
			},

			showt(){
				if (!Number.isInteger(this.mtopup.fee)) {
					this.isdisable2= true
				}else if(this.leftFund< this.mtopup.fee) {
					this.isdisable = true
				}else{
					this.isdisable = false
					this.isdisable2 = false
				}
			},
			 displayNameFilter(sid, options) {
      		const finded = options.find((option) => option.id === sid)
      		if (finded) {
        		return finded.name
      			} else {
        			console.log(sid)
      			}
				},
			hidd2() {
			this.VisibleInput2 = false;
			this.VisibleSelect2 = true;
			},
			handleSelect2(item) {
				fetchGetCustomer(item.id).then(response => {
				this.mergeID = response.data.vid
				this.name = response.data.name
				this.phone = response.data.phone
				this.leftFund = response.data.leftFund
				this.VisibleSelect2 = false;
				this.VisibleInput2 = true;

				});
				},
				querySearchAsync2(queryString, cs) {

				if(queryString === undefined || queryString.length < 4){
					let list = [{ value: "输入4位以上数字" }];
					cs(list);
					return
				}
				// console.log(queryString)
				if( queryString.length >3){
					
				fetchCustomerList({selectId:queryString}).then(response => {
					// this.custList = response.data.list;
					let list = [{}];
					for (let ite of response.data.list) {
					ite.value = "ID:" + ite.vid + "卡:" + ite.cNo;
					}
					list = response.data.list;
					if (list.length === 0) {
					list = [{ value: "查找不到顾客信息" }];
					}
					cs(list);
				});
				}
			
				},
		}
	}
</script>

<style lang="stylus" scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}

</style>

