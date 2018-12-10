import request from '@/utils/request'

/**
 * [fetchCustomerList 获取顾客列表]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function fetchList(query)
{
	return request({
		url:'/api/versionList',
		method:'get',
		params:query
	})
}
/**
 * [fetchGetCustomer 获取顾客资料]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function fetchGetAndroidv(id)
{
	return request({
		url:'/api/android/' + id,
		method:'get',
		
	})
}

/**
 * [fetchUpdateCustomer 修改顾客信息]
 * @param  {[type]} id   [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateAndroidv(id,data)
{
	return request({
		url:'/api/android/' + id,
		method:'put',
		data
	})
}

/**
 * [fetchAddCustomer 添加获取]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
export function createAndroidv(query)
{
	return request({
		url:'/api/android',
		method:'post',
		params:query
	})
}
