import Vue from 'vue'
// UI
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
/**
 * 移动端使用/小程序
 */
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import Element from 'element-ui'

// if (process.env.NODE_ENV === 'development') {
require('element-ui/lib/theme-chalk/index.css')
// }
// import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
// import '@/styles/theme/theme-ytf.css' // global css
// 表单验证
import AsyncValidator from 'async-validator'
import { messages } from '@/utils/messages'
Object.assign(AsyncValidator.messages, messages)
// VUE 组件
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data
import './mobileViews/shop/common/fonts/ytf.css'

if (process.env.NODE_ENV === 'development') {
Vue.use(Element, {i18n: (key, value) => i18n.t(key, value) }       )
}
import * as filters from './filters' // global filters

// Vue.use(Element, {
//   size: 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * element的notify跟vant的命名重复, 默认使用element的
 * Wed Dec  5 17:47:14 2018
 */
import { Notification } from 'element-ui'
Vue.prototype.$notify = Notification

import { Notify } from 'vant'
Vue.prototype.$notice = Notify

Vue.config.productionTip = false
Vue.prototype.$_has = function (feature) {
  let resources = [];
  let permission = true;
  let routeName = store.state.user.routeName
  let roles = store.state.user.roles // 当前用户角色
  // 对admin角色自动显示所有按钮
  if (Array.indexOf(roles, 'admin') !== -1) {
    return true
  }
  // 提取权限数组
  if (Array.isArray(feature)) {
  } else {
    // 判断是否有指定的功能权限
    // permission = Array.indexOf(routeName,feature) === -1 ? false : true
    permission = routeName.findIndex(item => item === feature) >= 0 ? true : false
  }
  return permission;
}

let i = 0
import { fetchOrder } from '@/api/order'
Vue.prototype.$pay = function(config) {
  this.timeout = setInterval(() => {
    if (i >= 3) {
      clearInterval(this.timeout)
    }
  }, 1000)
}
Vue.prototype.$pay()
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus',
  // 当被绑定的元素插入到 DOM 中时……
  function(el, { value }, { context }) {
    if (value) {
      context.$nextTick(() => {
        el.focus()
      })
    }
  })

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  // template: '<App/>',
  components: { App }
})
