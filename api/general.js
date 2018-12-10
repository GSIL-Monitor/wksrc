import request from "@/utils/request"


export function fetchCapionList(query){
    return request({
        url:'/api/caption',
        method:'get',
        params:query
    })
}
