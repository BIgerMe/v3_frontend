// @ts-ignore
import request from '@/utils/request'

export async function detail(params:any) {
  return request({
    url: '/blog/detail',
    method: 'get',
    params
  })
}
export function category(params:any) {
  return request({
    url: '/blog/category',
    method: 'get',
    params
  })
}
export function blogList(params: any) {
  return request({
    url: '/blog/list',
    method: 'get',
    params
  })
}

export function edit(data: any) {
  return request({
    url: '/blog/edit',
    method: 'post',
    data
  })
}
