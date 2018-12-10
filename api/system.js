import request from '@/utils/request'

/**
 * 获取数据字典名字列表
 */
export function fetchDList() {
  return request({
    url: '/api/dlist',
    method: 'get'
  })
}

/**
 * 获取指定字段字典列表
 */
export function fetchDict(fieldName, isM = undefined, uid = undefined, sid = undefined) {
  return request({
    url: '/api/dlist/' + fieldName,
    method: 'get',
    params: {
      isM,
      sid,
      uid
    }
  })
}
