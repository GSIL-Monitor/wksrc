import request from '@/utils/request'

export function fetchPayList(query){
	return request({
		url:'/api/payInfo',
		method:'get',
		params:query
	})
}
export function fetchInvoiceLogList(query){
	return request({
		url:'/api/getInvoiceLogList',
		method:'get',
		params:query
	})
}
export function shopList(){
	return request({
		url:'/api/dlist/shop?sid=0&isM=1',
		method:'get',
	})
}
