import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      email:username,
      password
    }
  })
}
export function login(username, password) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      email:username,
      password
    }
  })
}

/**
 * 手机后台登录
 * @author errocks
 * @add 2018-07-13 18:40:39
 */
export function mobileLogin(username, password) {
  return request({
    url: '/api/mobile/login',
    method: 'post',
    data: {
      name: username,
      password
    }
  })
}

export function loginWithThree(username, password,platformId,provider) {
  return request({
    url: '/api/loginWithThree',
    method: 'post',
    data: {
      email:username,
      password,
      platformId,
      provider
    }
  })
}
export function getInfo() {
  return request({
    url: '/api/user',
    method: 'get',
  })
}

  export function loginToken() {
    return request({
      url: '/api/token/refresh',
      method: 'post'
    })
  }

  export function logout() {
    return request({
      url: '/api/logout',
      method: 'post'
    })
  }

  export function getUserInfo(token) {
    return request({
      url: '/user/info',
      method: 'get',
      params: { token }
    })
  }

/**
 * 获取后台当前登录账号会话信息
 */
export function getSession() {
  return request({
    url: '/api/getSession',
    method: 'get'
  })
}
