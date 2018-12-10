import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import Dict from './modules/dict'
import shop from './modules/shop'

import getters from './getters'
import { fetchDict } from '@/api/system'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    dict: Dict,
    shop
  },
  getters
})

export function dict(fieldName, isM, uid, sid) {
  return new Promise((resolve, reject) => {
    var data
    if (store.state.dict[fieldName].values.length !== 0 && sid !== undefined && uid !== undefined) {
      // 只缓存session对应sid, uid 的数据
      data = store.state.dict[fieldName].values
      resolve(data)
    } else {
      const sidS = sid !=null ? sid : store.state.user.session.sid
      fetchDict(fieldName, isM, uid, sidS).then(response => {
        store.commit('SET_DICT', { fieldName: fieldName, values: response.data.list })
        data = response.data.list
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    }
  })
}

export default store
