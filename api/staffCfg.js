import request from '@/utils/request'

export function fetchStaffMealCFGList(query) {
  return request({
    url: '/api/staffMealCFG',
    method: 'get',
    params: query
  })
}

export function fetchStaffMealCFG(id) {
  return request({
    url: '/api/staffMealCFG/' + id,
    method: 'get',
  })
}


export function createStaffMealCFG(data) {
  return request({
    url: '/api/staffMealCFG',
    method: 'post',
    data
  })
}

export function updateStaffMealCFG(id,data) {
  return request({
    url: '/api/staffMealCFG/'+id,
    method: 'put',
    data
  })
}
