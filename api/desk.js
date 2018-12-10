import request from '@/utils/request'

const prefix = ''
/**
 * 餐桌(房间)列表
 */
export function fetchDeskList(query) {
  return request({
    url: prefix + '/api/shopRoom',
    method: 'get',
    params: query
  })
}

/**
 * 添加餐桌(房间)
 */
export function createDesk(data) {
  return request({
    url: prefix + '/api/shopRoom',
    method: 'post',
    data
  })
}

/**
 * 修改餐桌(房间)
 */
export function updateDesk(id, data) {
  return request({
    url: prefix + '/api/shopRoom/' + id,
    method: 'put',
    data
  })
}
/**
 * 删除餐桌(房间)
 */
export function deleteClass(id) {
  return request({
    url: prefix + '/api/shopRoom/' + id,
    method: 'delete',
  })
}
/**
 * 开启餐桌
 * @param {} id 
 */
export function openDesk(id){
  return request({
    url:prefix + '/api/openDesk/' + id,
    method:'get',
  })
}
/**
 * 空餐桌
 * @param {} id 
 */
export function emptyDesk(id){
  return request({
    url:prefix + '/api/emptyDesk/' + id,
    method:'get',
  })
}
/**
 * 订单的服务项
 * @param {} id 
 */
export function orderSrv(oid){
  return request({
    url:prefix + '/api/orderSrv/' + oid,
    method:'get',
  })
}
/**
 * 取消订单的服务项
 * @param {*} id 
 * @param {*} oid 
 * @param {*} oitemid 
 */
export function srvCancel(id,data){
  return request({
    url:prefix + '/api/srvCancel/' + id,
    method:'put',
    data
  })
}
/**
 * 退菜
 */
export function srvWithdraw(id,oid,oitemid,data){
  return request({
    url:prefix + '/api/srvWithdraw/' + id +'/' + oid + '/' + oitemid,
    method:'put',
    params:data
  })
}
/**
 * 获取餐桌的图片
 */
export function getDeskPic(roomId){
  return request({
    url:prefix + '/api/getRoomACode' + '/'+ roomId,
    method:'get',
  })
}
/**
 * 获取餐桌信息
 */
export function getDeskInfo(roomId){
  return request({
    url:prefix + '/api/shopRoom' + '/'+ roomId,
    method:'get',
  })
}
/**
 * 添加预订记录
 */
export function createdBookrec(data){
  return request({
    url:prefix + '/api/deskBooking',
    method:'post',
    params:data
  })
}