import request from '@/utils/request'

export function fetchProductList(query) {
  return request({
    url: '/api/productList',
    method: 'get',
    params: query
  })
}

/**
 * ----------------------------------------------------------------------
 * 手机前端
 * ----------------------------------------------------------------------
 */
export function wxProductList(query) {
  return request({
    url: '/api/mobile/WXproductList',
    method: 'get',
    params: query
  })
}

/**
 * 产品最新库存列表
 */
export function productStock(sid = '', query) {
  return request({
    url: '/api/pStock/' + sid,
    method: 'get',
    params: query
  })
}
/**
 * 获取产品基本信息
 */
export function fetchProduct(id) {
  return request({
    url: '/api/productInfo/' + id,
    method: 'get',
    params: { }
  })
}

/**
 * 添加产品
 */
export function createProduct(data) {
  return request({
    url: '/api/addProduct',
    method: 'post',
    data
  })
}

/**
 * 添加产品
 */
export function updateProduct(data) {
  return request({
    url: '/api/updateProduct',
    method: 'post',
    data
  })
}

/**
 *获取产品设置信息
 */
export function fetchProductCFG(id) {
  return request({
    url: '/api/productCFG/' + id,
    method: 'get',
    params: { }
  })
}

/**
 *修改产品基本信息
 */
export function updateProductCFG(data) {
  return request({
    url: '/api/updateProductCFG',
    method: 'post',
    data
  })
}

/**
 *产品分类列表
 */
export function fetchClassList(query) {
  return request({
    url: '/api/productCatList',
    method: 'get',
    params: query
  })
}
/**
 *厨房打印设置列表
 */
export function fetchPtrCFGList(query) {
  return request({
    url: '/api/ptrCFGList',
    method: 'get',
    params: query
  })
}

/**
 * 添加产品分类
 */
export function createClass(data) {
  return request({
    url: '/api/addPCat',
    method: 'post',
    data
  })
}

/**
 * 修改产品分类
 */
export function updateClass(data) {
  return request({
    url: '/api/updatePCat',
    method: 'post',
    data
  })
}

/**
 * 删除产品分类
 */
export function deleteClass(id) {
  return request({
    url: '/api/delPCat',
    method: 'post',
    params: { id }
  })
}
/**
 * 删除产品
 */
export function delProduct(id) {
  return request({
    url: '/api/delProduct',
    method: 'post',
    params: { id }
  })
}

/**
 *产品规格列表
 */
export function fetchProductPropList(pid) {
  return request({
    url: '/api/productPropList',
    method: 'get',
    params: { pid }
  })
}

/**
 * 添加产品规格
 */
export function createProductProp(data) {
  return request({
    url: '/api/addPProp',
    method: 'post',
    data
  })
}

/**
 * 修改产品规格
 */
export function updateProductProp(data) {
  return request({
    url: '/api/updatePProp',
    method: 'post',
    data
  })
}

/**
 * 删除产品规格
 */
export function deleteProductProp(id) {
  return request({
    url: '/api/delPProp',
    method: 'post',
    params: { id }
  })
}

/**
 *产品规格列表
 */
export function fetchProductPropVList(ppid) {
  return request({
    url: '/api/productPropV',
    method: 'get',
    params: { ppid }
  })
}

/**
 * 添加产品规格值
 */
export function createProductPropV(data) {
  return request({
    url: '/api/addPPropV',
    method: 'post',
    data
  })
}


/**
 * 修改产品规格值
 */
export function updateProductPropV(data) {
  return request({
    url: '/api/updatePPropV',
    method: 'post',
    data
  })
}

/**
 * 删除产品规格值
 */
export function deleteProductPropV(id) {
  return request({
    url: '/api/delPPropV',
    method: 'post',
    params: { id }
  })
}

/**
 * 获取产品id的sku对应库存列表
 */
export function fetchSKUStockList(pid) {
  return request({
    url: '/api/productSKUStock/' + pid,
    method: 'get'
  })
}

/**
 * 更新SKU库存
 */
export function updateSKUStock(data) {
  return request({
    url: '/api/productSKUStock',
    method: 'put',
    data
   })
}

/**
 * 开启产品SKU库存
 */
export function initSKUStock(pid, force) {
  return request({
    url: '/api/resetSKUStock/' + pid,
    params: { force }
  })
}

/**
 * 产品销售排行
 */
export function WXproductRank() {
  return request({
    url: '/api/mobile/WXproductRank',
    method: 'get'
  })
}

/**
 * 开启产品SKU库存
 */
export function OProductStock(id, query) {
  return request({
    url: '/api/productStock/' + id,
    method:'put',
    params: query
  })
}
/**
 * 获取产品的小程序图片
 */
export function getProductACode(id) {
  return request({
    url: '/api/getProductACode/' + id,
    method:'get',
  })
}
