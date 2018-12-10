/**
 * 订单相关API接口
 */
import request from '@/utils/request'
import later from '@/utils/index'

export const OrderConfig = {
  status: {
    UN_CONFIRM: 0,              // 未确认
    CONFIRMED: 1,               // 已确认
    TRANSFER: 2,                // 配送中
    SUCCEED: 3,                 // 配送成功
    FAILED: 4,                  // 配送失败
    FINISHED: 5,                // 已完成
    CANCELED: 6,                // 已取消
    DELETED: 10                 // 已删除
  },
  otype: {
    INSHOP: 0,
    OUTSHOP: 1,
    PRE_INSHOP: 2,
    PRE_OUTSHOP: 3,
    COUPON_SHOP: 7
  },
  oPayType: {
    WECHAT: 0,                  // 微信
    CASH: 1,                    // 现金
    BANK: 2,                    // 银行刷卡
    LOSSES: 3,                  // 挂账
    COMPANY: 4,                 // 公司招待
    MEMBER: 5,                  // 会员支付
    ALIPAY: 20,                 // 支付宝
    COMPOSE: 99,                // 组合支付
    WECHAT_MICROPAY: 100        // 微信刷卡
  },
  payFlag: {
    UNPAY: 0,
    PAYED: 1,
    HANG: 2
  },
  jumpType: {
    DEFAULT: 0,                 // 支付成功跳转;
    WECHAT_SCAN: 1,             // 跳转至微信扫码;
    ALIPAY_SCAN: 2,             // 跳转至支付宝扫码;
    WECHAT: 3,                  // 发起微信支付
    WECHAT_MICROPAY: 4          // 发起微信刷卡
  }
}

/**
 * 添加订单
 */
export function orderAdd(data) {
  return request({
    url: '/api/order',
    method: 'post',
    data
  })
}

/**
 * 获取订单信息
 */
export function fetchOrder(id) {
  return request({
    url: '/api/order/' + id,
    method: 'get'
  })
}

/**
 * 查询订单列表
 */
export function fetchOrderList(params) {
  return request({
    url: '/api/order',
    method: 'get',
    params: params
  })
}

/**
 * 添加订单项目(批量)
 */
export function orderItemsAdd(data) {
  return request({
    url: '/api/orderItems',
    method: 'post',
    data
  })
}

/**
 * 添加订单项目
 */
export function orderItemAdd(data) {
  return request({
    url: '/api/orderItem',
    method: 'post',
    data
  })
}

/**
 * 添加赠送订单项目
 */
export function orderGiftItemAdd(data) {
  return request({
    url: '/api/orderGiftItem',
    method: 'post',
    data
  })
}

/**
 * 修改订单项规格
 */
export function orderItemPropUpdate(id, oid, data) {
  return request({
    url: '/api/orderItemProp/' + id + '/' + oid,
    method: 'put',
    data
  })
}

/**
 * 修改订单项目数量(批量)
 */
export function orderItemsUpdate(oid, data) {
  return request({
    url: '/api/orderItems/' + oid,
    method: 'put',
    data
  })
}

/**
 * 修改订单项目数量
 */
export function orderItemUpdate(id, oid, data) {
  return request({
    url: '/api/orderItem/' + id + '/' + oid,
    method: 'put',
    data
  })
}

/**
 * 获取订单结帐信息
 */
export function fetchOrderPayInfo(id) {
  return request({
    url: '/api/orderPay/' + id,
    method: 'get'
  })
}

/**
 * 订单结账
 */
export function orderPay(id, data) {
  return request({
    url: '/api/orderPay/' + id,
    method: 'post',
    data
  })
}

/**
 * 订单提交
 */
export function orderSubmit(id, data) {
  return request({
    url: '/api/orderSubmit/' + id,
    method: 'put',
    data
  })
}

/**
 * 微信扫码二维码
 */
export function wxPayQrcode(id)  {
  return request({
    url: '/api/wxPayQrCode/' + id,
    method: 'get'
  })
}

/**
 * 支付                         // UNFISHED
 */
export function pay(oPayType, orderId, payInfo) {
  orderPay()
  switch (oPayType) {
  case OrderConfig.oPayType.MEMBER:
    checkPayStatus(orderId)
    break
  case OrderConfig.oPayType.WECHAT:
    break
  }
}

// UNFISHED
export function checkPayStatus(orderId, success, fail, count = 60) {
  fetchOrder(orderId).then(response => {
    const orderInfo = response.data
    switch (orderInfo.payflag) {
    case OrderConfig.payFlag.UNPAY:
      setTimeout(() => {
        checkPayStatus(orderId, success)
      }, 1000)
      break
    case OrderConfig.payFlag.PAYED:
      success(orderInfo)
      break
    case OrderConfig.payFlag.HANG:
      break
    }
    return res
  })


}
/**
 * 反结账
 * @param {} query
 */
export function orderPayUndo(data){
    return request({
      url:'/api/orderPayUndo',
      method:'post',
      data
    })
}
/**
 * 打印订单
 * @param {} query
 */
export function orderRePrint(data){
    return request({
      url:'/api/orderRePrint',
      method:'post',
      data
    })
}

/**
 * 叫起
 */
export function srvStart(id) {
  return request({
    url: '/api/srvStart2/' + id,
    method: 'put'
  })
}

/**
 * 获取订单的菜品加工
 */
export function orderSrv(id) {
  return request({
    url: '/api/orderSrv/' + id,
    method: 'get'
  })
}
/**
 * 订单扑打
 */
export function orderFBRePrint(data) {
  return request({
    url: '/api/orderFBRePrint',
    method: 'post',
    params:data
  })
}

/**
 * 订单扑打
 */
export function orderChangeCID(data) {
  return request({
    url: '/api/orderCID',
    method: 'post',
    params: data
  })
}

/**
 * 发起微信刷卡支付
 * @author errocks
 * @add 2018-11-26 14:29:44
 */
export function wxMicroPay(data) {
  return request({
    url: '/api/wxMicroPay',
    method: 'post',
    params: data
  })
}

/**
 * 发起微信支付订单查询
 * @author errocks
 * @add 2018-12-01 22:14:11
 */
export function wxOrderquery(tradNo) {
  return request({
    url: '/api/wxOrderquery/' + tradNo,
    method: 'get'
  })
}
