import request from '@/utils/request'

const prefix = ''
/**
 * 获取店铺列表
 */

export function fetchShopList(query) {
  return request({
    url: prefix + '/api/shop',
    method: 'get',
    params: query
  })
}

/**
 * 获取店铺基本信息
 */
export function fetchShop(id) {
  return request({
    url: prefix + '/api/shop/' + id,
    method: 'get'
  })
}

/**
 * 修改店铺基本信息
 */
export function updateShop(id, data) {
  return request({
    url: prefix + '/api/shop/' + id,
    method: 'put',
    data
  })
}

/**
 * 添加店铺
 */
export function createShop(data) {
  return request({
    url: prefix + '/api/shop',
    method: 'post',
    data
  })
}

/**
 * 获取店铺区域列表
 */
export function fetchShopAreaList(query) {
  return request({
    url: prefix + '/api/sRoomArea',
    method: 'get',
    params: query
  })
}

/**
 * 获取店铺区域信息
 */
export function fetchShopArea(id) {
  return request({
    url: prefix + '/api/sRoomArea/' + id,
    method: 'get'
  })
}

/**
 * 修改店铺区域信息
 */
export function updateShopArea(id, data) {
  return request({
    url: prefix + '/api/sRoomArea/' + id,
    method: 'put',
    data
  })
}

/**
 * 添加店铺区域
 */
export function createShopArea(data) {
  return request({
    url: prefix + '/api/sRoomArea',
    method: 'post',
    data
  })
}
/**
 * 获取工作区域列表
 */
export function fetchWorkAreaList(query) {
  return request({
    url: prefix + '/api/workArea',
    method: 'get',
    params: query
  })
}

/**
 * 获取工作区域信息
 */
export function fetchWorkArea(id) {
  return request({
    url: prefix + '/api/workArea/' + id,
    method: 'get'
  })
}

/**
 * 修改工作区域信息
 */
export function updateWorkArea(id, data) {
  return request({
    url: prefix + '/api/workArea/' + id,
    method: 'put',
    data
  })
}

/**
 * 添加工作区域
 */
export function createWorkArea(data) {
  return request({
    url: prefix + '/api/workArea',
    method: 'post',
    data
  })
}

/**
 * 获取店铺设置信息
 */

export function fetchShopConfig(id = '') {
  return request({
    url: prefix + '/api/shopCfg/' + id,
    method: 'get'
  })
}
/**
 * 修改店铺设置信息
 */

export function updateShopConfig(id,data) {
  return request({
    url: prefix + '/api/shopCfg/' + id,
    method: 'put',
    data
  })
}
/**
 * 获取商铺的小程序图片
 */
export function getShopACode(id) {
  return request({
    url: '/api/getShopACode/' + id,
    method:'get',
  })
}