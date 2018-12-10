import request from "@/utils/request"
/**
 * 获取营收数据
 * @param {*} query 
 */
export function revenueData(query){
    return request({
        url:'/api/getRevenueList',
        method:'get',
        params:query
    })
}
/**
 * 获取营收数据
 * @param {*} query 
 */
export function getDepositList(query){
    return request({
        url:'/api/getDepositList',
        method:'get',
        params:query
    })
}
/**
 * 获取本次交班的信息
 * @param {*} query 
 */
export function getCashierInfo(query){
    return request({
        url:'/api/getCashierInfo',
        method:'get',
        params:query
    })
}
/**
 * 获取交班的明细
 * @param {*} query 
 */
export function getCashierDetail(id){
    return request({
        url:'/api/getCashierDetail/'+id,
        method:'get',
    })
}
/**
 * 交班
 * @param {*} query 
 */
export function cashier(query){
    return request({
        url:'/api/cashier',
        method:'get',
        params:query
    })
}
/**
 * 获取交班列表
 * @param {*} query 
 */
export function getCashierList(query){
    return request({
        url:'/api/getCashierList',
        method:'get',
        params:query
    })
}
/**
 * 反交班、
 * @param {*} query 
 */
export function UnCashier(id){
    return request({
        url:'/api/unCashier/'+id,
        method:'get',
    })
}
/**
 * 打印交班数据
 * @param {*} query 
 */
export function PrintCashierInfo(id){
    return request({
        url:'/api/printCashierInfo/'+id,
        method:'get',
    })
}
export function PrintDepositList(data){
    return request({
        url:'/api/printDepositList',
        method:'post',
        data
    })
}
export function PrintRevenueList(data){
    return request({
        url:'/api/printRevenueList',
        method:'post',
        data
    })
}
