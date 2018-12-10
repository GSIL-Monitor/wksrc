<template>
	<div class="createPost-container">
		<el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="250px">
			<el-row >
				<el-col :span="24">
					<code><span>商铺的会员设置</span></code>
			<el-form-item label="选择需要设置的店铺" prop="sid">
			 	<el-select clearable v-model="temp.sid" placeholder="选择店铺" @change="getShopInfo">
			 		<el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
			 	</el-select>
			</el-form-item>

			<el-form-item label="是否充值开通会员" prop="isCharge2Member">
          		<el-switch v-model="temp.isCharge2Member" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        	</el-form-item>

        	<el-form-item label="是否在线开通会员" prop="isOnline2Member">
          		<el-switch v-model="temp.isOnline2Member" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        	</el-form-item>
        	<el-form-item label="是否启用微信支付" prop="isWechatPay">
          		<el-switch v-model="temp.isWechatPay" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        	</el-form-item>
        	<el-form-item label="是否启用支付宝支付" prop="isAliPay">
          		<el-switch v-model="temp.isAliPay" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        	</el-form-item>
        	<el-form-item label="是否启用其它支付" prop="isOtherPay">
          		<el-switch v-model="temp.isOtherPay" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        	</el-form-item>

			<el-form-item label="上传会员卡图片" v-if="showu">
				
				<div style="margin-bottom: 20px;">
					<div style="color:red;">提示:能上传jpg 、jpeg 或者png的图片，不能上传直接修改图片后缀的图片</div>
          		<Upload v-model="picUrl" :id="id"/>
        		</div>
			</el-form-item>

				</el-col>
			</el-row>

			<el-row :gutter="0">
      			<el-button type="primary" @click='updateMCFG' size="small" icon="el-icon-edit">确认修改</el-button>
    		</el-row>
			
		</el-form>
	</div>
	
</template>

<script>
	import {fetchMemberCFG,updateMemberCFG,fetchShopList} from '@/api/customer'
	import Upload from '@/components/Upload/memberImgMain'
	// import Upload from '@/components/Upload/productImgMain'
	import { displayShopFilter } from '@/filters'

	export default{
		name: 'member-cfg',
		components:{Upload},
		props:{
			type:{
				type:String
			}
		},
		data(){
			return {
			shopOptions:[],
			id:false,
			temp:{
				id:undefined,
				sid:undefined,
				isCharge2Member:0,
				isOnline2Member:0,
				isWechatPay:1,
				isAliPay:1,
				isOtherPay:1,
				picUrl:undefined
			},
			rules:{
				id:[],
				sid:[],
				isCharge2Member:[{required:true,type:'integer'}],
				isOnline2Member:[{required:true,type:'integer'}],
				isWechatPay:[{required:true,type:'integer'}],
				isAliPay:[{required:true,type:'integer'}],
				isOtherPay:[{required:true,type:'integer'}],
				// picUrl:[{type:'string'}]
			},
			showu:false,
			}
		},
		computed:{
			picUrl() {return this.temp.picUrl ? process.env.BASE_API +'/' + this.temp.picUrl : ''}
		},
		created(){
			fetchShopList().then(response => {
				// this.shopOptions=response.data.list
				this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.list)
			})
		},
		methods:{
			resetTemp(){
				this.temp={
				id:undefined,
				sid:undefined,
				isCharge2Member:undefined,
				isOnline2Member:undefined,
				isWechatPay:undefined,
				isAliPay:undefined,
				isOtherPay:undefined,
				picUrl:undefined
			}
			this.id = undefined
			},

			getShopInfo(){
				fetchMemberCFG(this.temp.sid).then(response=>{
					this.resetTemp()
					this.showu=false
					this.temp = response.data
					this.id = response.data.id
					this.showu=true
				// console.log(this.id)
				})
			},
			updateMCFG(){
				this.$refs['dataForm'].validate((valid)=>{
					if (valid) {
						let tempData = Object.assign({},this.temp)
						updateMemberCFG(tempData.id,tempData).then(()=>{
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