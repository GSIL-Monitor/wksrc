/**
 * 这里就是所有vue组件共享的状态
 */
const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  session: state => state.user.session,
  shop: state => state.shop,
  cid: state => state.shop.config.shopvid,
  uid: state => state.user.session.uid,
  sid: state => state.user.session.sid,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  productList: state => state.shop.productList
}
export default getters
