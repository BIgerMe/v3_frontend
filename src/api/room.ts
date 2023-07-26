// @ts-ignore
import request from '@/utils/request'

export function roomList(params: any) {
  return request({
    url: '/room/list',
    method: 'get',
    params
  })
}
export function roomAdd(data: any) {
  return request({
    url: '/room/add',
    method: 'post',
    data
  })
}
export function roomAddTo(data: any) {
  return request({
    url: '/room/addto',
    method: 'post',
    data
  })
}

