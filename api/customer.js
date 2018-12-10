import request from '@/utils/request'

/**
 * [fetchCustomerList 获取顾客列表]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchCustomerList(query)
{
	return request({
		url:'/api/customer',
		method:'get',
		params:query
	})
}
/**
 * [fetchGetCustomer 获取顾客资料]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchGetCustomer(id)
{
	return request({
		url:'/api/customer/' + id,
		method:'get',
		
	})
}

/**
 * [fetchUpdateCustomer 修改顾客信息]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateCustomer(id,data)
{
	return request({
		url:'/api/customer/' + id,
		method:'put',
		data
	})
}

/**
 * [fetchAddCustomer 添加获取]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function createCustomer(query)
{
	return request({
		url:'/api/customer',
		method:'post',
		params:query
	})
}

export function fetchShopList(){
	return request({
		url:'/api/shop',
		method:'get'
	})
}

/**
 * [fetchMemberCFG 获取会员设置]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchMemberCFG(sid){
	return request({
		url:'/api/memberCFG/' + sid,
		method:'get',
	})
}
/**
 * 修改会员设置
 */
export function updateMemberCFG(id,data){
	return request({
		url:'/api/memberCFG/' + id,
		method:'put',
		data
	})
}
/**
 * [fetchmChargeCFGList 会员充值设置列表]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchmChargeCFGList(query){
	return request({
		url:'/api/mChargeCFG',
		method:'get',
		params:query
	})
}
/**
 * [fetchmChargeCFG 获取会员充值设置]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchmChargeCFG(id){
	return request({
		url:'/api/mChargeCFG/' +id,
		method:'get',
	})
}
/**
 * [createmChargeCFG 新建会员充值设置]
 * @param  {[type]} query [description]
 * @return {[type]}      [description]
 */
export function createmChargeCFG(query){
	return request({
		url:'/api/mChargeCFG',
		method:'post',
		params:query
	})
}
/**
 * [updatemChargeCFG 更新会员充值设置]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updatemChargeCFG(id,data){
	return request({
		url:'/api/mChargeCFG/'+id,
		method:'put',
		params:data
	})
}
/**
 * [mergeCustomerID 合并顾客ID]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function mergeCustomerID(id,data)
{
	return request({
		url:'/api/mergeCustomerID/'+ id,
		method:'get',
		params:data
	})
}
/**
 * [changeCLevel 顾客等级变更]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function changeCLevel(id,data){
	return request({
		url:'/api/changeCLevel/'+id,
		method:'get',
		params:data
		})
}
/**
 * [customerDel 顾客账号作废]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function customerDel(id,data){
	return request({
		url:'/api/customerDel/'+id,
		method:'get',
		params:data
	})
}
/**
 * [customerRestore 账号恢复]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function customerRestore(id,data){
	return request({
		url:'/api/customerRestore/'+id,
		method:'get',
		params:data
	})
}
/**
 * [deposit 会员充值]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function deposit(query){
	return request({
		url:'/api/deposit',
		method:'post',
		params:query
	})
}
/**
 * [aRefund 会员退款]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function aRefund(query){
	return request({
		url:'/api/aRefund',
		method:'post',
		params:query
	})
}
/**
 * [getLeftFund 获取顾客在某店铺余额]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getLeftFund(data){
	return request({
		url:'/api/getLeftFund',
		method:'get',
		params:data
		})
}
/**
 * [fetchMeneyLogList 获取余额记录]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchMeneyLogList(query){
	return request({
		url:'/api/moneyLogList',
		method:'get',
		params:query
	})
}

export function fetchPayInfo($id){
	return request({
		url:'/api/member/'+$id,
		method:'get'
	})
}
//检查顾客信息
export function CheckCust(data){
	return request({
		url:'/api/checkCust',
		method:'post',
		data
	})
}
//批量充值
export function BatchDeposit(data){
	return request({
		url:'/api/batchDeposit',
		method:'post',
		data
	})
}
//获取批量充值模板
export function getTemplate(){
	return request({
		url:'/api/getBatchTPL',
		method:'get',

	})
}
//获取地址
export function AddList(data){
	return request({
		url:'/api/customerAddr',
		method:'get',
		params:data
	})
}
//开发票
export function ChargeInvoices(id,data){
	return request({
		url:'/api/chargeInvoices/' + id,
		method:'post',
		data
	})
}
