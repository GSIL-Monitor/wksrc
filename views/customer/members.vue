<template>
	<div class="tab-container">
		<el-tag>会员设置和充值管理</el-tag>
		
		<el-tabs style="margin-top: 15px;" v-model="activeName" type="card">
			<el-tab-pane label="会员设置" key='cfg' name="cfg">
				<keep-alive>
					<member-cfg type="cfg"></member-cfg>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane label="充值设置管理" key='topup' name="topup">
				<keep-alive>
					<member-topup type="topup"></member-topup>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane label="充值升级管理" key='upgrad' name="upgrad">
				<keep-alive>
					<member-upgrad type="upgrad"></member-upgrad>
				</keep-alive>
			</el-tab-pane>
		</el-tabs>
	</div>
	
</template>
<script >
	import MemberCfg from './components/MemberCfg'
	import MemberTopup from './components/MemberTopup'
	import MemberUpgrad from './components/MemberUpgrad'

	export default {
		name: 'customer-members',
		components :{MemberCfg,MemberTopup,MemberUpgrad},

		data(){
			return {
				activeName: 'cfg',
			}
		},
		methods: {
  }

	}
</script>
<style scoped>
.tab-container{
    margin: 30px;
}
</style>