import request from "@/utils/request"


export function fetchStaffList(query){
    return request({
        url:'/api/staff',
        method:'get',
        params:query
    })
}
export function getSRoomArea(query){
    return request({
        url:'/api/sRoomArea',
        method:'get',
        params:query
    })
}
export function getWorkArea(query){
    return request({
        url:'/api/workArea',
        method:'get',
        params:query
    })
}
export function createStaff(query){
    return request({
        url:'/api/staff',
        method:'post',
        params:query
    })
}
export function createStaff2(query){
    return request({
        url:'/api/staff2',
        method:'post',
        params:query
    })
}
export function updateStaff(id,date){
    return request({
        url:'/api/staff/' + id,
        method:'put',
        params:date
    })
}
export function updateStaff2(id,date){
    return request({
        url:'/api/staff2/' + id,
        method:'put',
        params:date
    })
}
export function getStaff(id){
    return request({
        url:'/api/staff/' + id,
        method:'get',
    })
}
export function getStaff2(id){
    return request({
        url:'/api/staff2/' + id,
        method:'get',
    })
}
export function ChangePasswrod(data){
    return request({
        url:'/api/changePasswrod',
        method:'post',
        data
    })
}