import request from '@/utils/request'

/**
 * 根据条件 获取打印设置
 * [fetchPtrCFGList description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchPtrCFGList(query){
	return request({
		url:'/api/ptrCFGList',
		method:'get',
		params:query
	})
}

/**
 * 获取商店的区域信息
 * [fetchSRoomArea description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchSRoomArea(query)
{
	return request({
		url:'/api/sRoomArea',
		method:'get',
		params:query
	})
}
/**
 * 获取商店的工作区域信息
 * [fetchSRoomArea description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchWorkArea(query)
{
	return request({
		url:'/api/workArea',
		method:'get',
		params:query
	})
}
/**
 * [createPrintcfg 创建打印设置]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createPrintcfg(data){
	return request({
		url:'/api/addPtrCFG',
		method:'post',
		data
	})
}
/**
 * [fetchPtrCFG 获取打印设置的信息] 
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchPtrCFG(id){
	return request({
		url:'/api/getPtrCFG/' + id,
		method:'get'
	})
}
/**
 * [fetchPtrCFG 获取打印设置的信息] 
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function delPtrCFG(id){
	return request({
		url:'/api/delPtrCFG/' + id,
		method:'post'
	})
}
/**
 * 更新
 * @param {*} id 
 * @param {*} data 
 */
export function updatePtrCFG(id,data)
{
	return request({
		url:'/api/updatePtrCFG/' +id,
		method:'put',
		data
	})
}





/**
 * 根据条件 获取打印模板
 * [fetchPtrCFGList description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchPtrTplList(query){
	return request({
		url:'/api/getTemplateList',
		method:'get',
		params:query
	})
}

/**
 * [createPtrTpl 添加打印模板]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createPtrTpl(data){
	return request({
		url:'/api/addTemplate',
		method:'post',
		data
	})
}

/**
 * [fetchPtrCFG 获取打印模板的信息]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchPtrTpl(id){
	return request({
		url:'/api/getTemplate/' + id,
		method:'get'
	})
}
/**
 * [updatePtrCFG 更新打印模板]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updatePtrTpl(id,data)
{
	return request({
		url:'/api/updateTemplate/' +id,
		method:'put',
		data
	})
}
/**
 * [updatePtrCFG 获取打印机状态]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getPtrStatus(id)
{
	return request({
		url:'/api/getPtrStatus/' +id,
		method:'get',
	})
}
/**
 * [updatePtrCFG 打印商户]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getMerchantList()
{
	return request({
		url:'/api/getMerchantList',
		method:'get',
	})
}