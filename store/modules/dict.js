import Cookies from 'js-cookie'
import { fetchDList, fetchDict } from '@/api/system'

const dict = {
  state: {
    // oType: [],	// 订单类型
    // cLevel: [],	// 顾客等级
    // oStatus: [],	// 订单状态
    // opType: [],	// 操作类型
    // payType: [],	// 支付方式
    // cpStatus: [],	// 优惠券状态
    // cpSource: [],	// 优惠券来源
    // mopType: [],	// 资金变动操作类型
    // oPayType: [],	// 订单支付方式
    // ghtype: [],	// 公众号类型
    // sType: [],	// 积分记录操作类型
    // roomStatus: [],	// 房间(餐桌)状态
    // tradeType: [],	// 交易类型
    // opCode: [],	// 系统操作编码
    // jobType: [],	// 职位/工种
    // workStatus: [],	// 工作状态
    // rType: [],	// 房间类型
    // isSaleType: [],	// 商品所属类型
    // bankCode: []	// 银行卡所在开户行编号
  },

  mutations: {
    /**
     * 初始化系统字典
     */
    INIT_DICT: (state, dictNameList) => {
      dictNameList.forEach(dict => {
        state[dict.FieldName] = dict
        state[dict.FieldName].values = []
      })
    },

    SET_DICT: (state, dict) => {
      state[dict.fieldName].values = dict.values
    }
  },

  actions: {
    InitDict({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetchDList().then(response => {
          commit('INIT_DICT', response.data.list)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
   }
}

export default dict
