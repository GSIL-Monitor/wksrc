import request from "@/utils/request"


export function fetchAddressList(data){
    return request({
        url:'/api/customerAddr',
        method:'get',
        params:data
    })
}

export function createAddress(data){
    return request({
        url:'/api/customerAddr',
        method:'post',
        data
    })
}

export function updataAddress(id,date){
    return request({
        url:'/api/customerAddr/' + id,
        method:'put',
        params:date
    })
}

export function getAddressInfo(id){
    return request({
        url:'/api/customerAddr/' + id,
        method:'get',
    })
}
