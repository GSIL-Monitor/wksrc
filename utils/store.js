import Cookies from 'js-cookie'
export function getItem(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

export function setItem(key, value) {
  return localStorage.setItem(key, JSON.stringify(value))
}

export function getCartItems() {
  return getItem('selectFoods')
}

export function setCartItems(items) {
  return setItem('selectFoods', items)
}

export function emptyCartItems() {
  setItem('selectFoods', [])
}

export function setSessionId(name, ID) {
  setItem('sessionId', ID)
  return Cookies.set(name, ID)
}

export function getSessionId() {
  return Cookies.get('PHPSESSID')
}

export function getOrders() {
  if (getItem('orders')) {
    return getItem('orders')
  } else {
    return []
  }
}

export function setOrders(data) {
  setItem('orders', data)
}

export function getOrderByDesk(deskId) {
  getOrders().find(item => {
    return item.deskId === deskId
  })
}

export function setOrderByDesk(data) {
  const deskId = data.deskId
  const orders = getOrders()
  const index = orders.findIndex(item => {
    return item.deskId === deskId
  })
  if (index !== -1) {
    orders.splice(index, 1, data)
    setOrders(orders)
  } else {
    orders.push(data)
    setOrders(orders)
  }
}
/**
 * 同步库存到产品列表
 */
export function doSyncStock(stockList, productList) {
  productList.forEach(product => {
    const finded = stockList.find(item => item.id === product.id)
    if (finded) {
      product.stockNum = parseFloat(finded.n) > 0 ? parseFloat(finded.n) : -1
    } else {
      product.stockNum = undefined
    }
  })
  return productList
}

export default {
  getItem,
  setItem,
  getCartItems,
  emptyCartItems,
  setCartItems
}
