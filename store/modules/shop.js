import { wxProductList, productStock, WXproductRank } from '@/api/product'
import { fetchShopConfig, fetchShop } from '@/api/shop'
import { doSyncStock } from '@/utils/store'

const shop = {
  state: {
    productList: [],
    rankList: [],
    stockList: [],
    syncid: undefined,
    order: { orderId: undefined, items: [], modifyDT: undefined },
    config: {},
    isPayNow2: false
  },

  mutations: {
    SET_PRODUCT_LIST: (state, productList) => {
      state.productList = productList
    },

    SET_SYNCID: (state, id) => {
      state.syncid = id
    },

    SET_ORDERID: (state, id) => {
      state.order.orderId = id
    },

    SET_ORDER_ITEMS: (state, items) => {
      state.order.items = items
    },

    SET_MODIFYDT: (state, time) => {
      if (!time) {
        time = 0
      }
      state.order.modifyDT = time
    },

    SET_CONFIG: (state, config) => {
      state.config = config
      state.isPayNow2 = config.isPayNow === 2
    },

    SET_PRODUCT_RANKS: (state, products) => {
      state.rankList = products
    },
    SET_STOCKS: (state, stocks) => {
      state.stockList = stocks
    }
  },
  /**
   * 方法大写
   */
  actions: {
    // 获取前端产品列表
    GetProductList({ dispatch, commit, state, rootState }, type) {
      return new Promise((resolve, reject) => {
        const query = {}
        query.type = type
        query.syncid = state.syncid
        if (query.syncid === '') {
          resolve(state.productList)
        } else {
          wxProductList(query).then(response => {
            let productList = response.data.list
            productList = productList.map(item => {
              const temp = {}
              temp.id = item.id
              temp.unit = item.u
              temp.catID = item.c
              temp.price = item.p
              temp.newPrice = 0
              temp.propPrice = 0
              temp.mpropPrice = 0
              temp.subPrice = item.sp
              temp.mPrice = parseFloat(item.mp)
              temp.isbyMass = item.m
              temp.stepMass = parseFloat(item.ms)
              temp.name = item.n
              temp.ename = item.en
              temp.feature = item.l
              temp.picUrl = item.i ? process.env.BASE_API + '/' + item.i : ''
              temp.icon = item.i ? process.env.BASE_API + '/' + item.i.slice(0, item.i.lastIndexOf('.')) + 's.jpg' : ''
              temp.isSku = item.sku
              temp.pSkuStr = ''
              temp.totalSell = item.sc
              temp.todaySell = item.sct
              temp.stockType = item.st
              temp.isFine = item.isf
              temp.opMinute = item.op
              temp.pts = item.pts
              temp.propList = [] // 选中的规格值组合
              temp.remark = '' // 选中的规格值组合
              // temp.selectedItems = [] // 确定购买的产品
              return temp
            })
            const session = rootState.user.session
            productStock(session.sid).then(response => {
              const stockList = response.data.list
              const list = doSyncStock(stockList, productList)
              commit('SET_PRODUCT_LIST', list)
              commit('SET_STOCKS', stockList)
              dispatch('SyncProductRank')
              resolve(list)
            })
            commit('SET_SYNCID', response.syncid)
          }).catch(response => {
            if (response.code === 304) {
              // 数据可以不用更新 do nothing
              const session = rootState.user.session
              const productList = state.productList
              productStock(session.sid).then(response => {
                const stockList = response.data.list
                const list = doSyncStock(stockList, productList)
                commit('SET_PRODUCT_LIST', list)
                commit('SET_STOCKS', stockList)
                resolve(list)
              })
            } else {
              reject(response)
            }
          })
        }
      })
    },

    /**
     * 同步最新库存列表到productList
     * @add 2018-10-12 11:11:36
     */
    SyncStock({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        const session = rootState.user.session
        const productList = state.productList
        productStock(session.sid).then(response => {
          const stockList = response.data.list
          const list = doSyncStock(stockList, productList)
          commit('SET_PRODUCT_LIST', list)
          commit('SET_STOCKS', stockList)
          resolve(stockList)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 同步最新的产品销量列表
     * @add 2018-10-12 11:15:09
     */
    SyncProductRank({ commit, state, rootState }) {
      WXproductRank().then(response => {
        const data = state.productList
        const ranks = response.data.list.map(v => {
          const finded = data.find(item => {
            return v.id === item.id
          })
          return finded
        })
        commit('SET_PRODUCT_RANKS', ranks)
      })
    },
    // 获取订单
    GetOrder({ commit, state }) {
      return new Promise(resolve => {
        resolve(state.productList)
      })
    },
    // 更新订单列表
    AddOrderItems({ commit, state }, items) {
      return new Promise((resolve, reject) => {
        commit('SET_ORDER_ITEMS', items)
        resolve()
      })
    },

    // 获取店铺设置
    GetShopConfig({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        fetchShopConfig(id).then(response => {
          commit('SET_CONFIG', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取店铺信息
    GetShopInfo({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        fetchShop(id).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default shop
