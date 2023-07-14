import request from '@/utils/request'

export async function login(params: any) {
  return request({
    url: '/user/login',
    method: 'post',
    params,
  })
}

export async function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}

export async function getUserInfo() {
  return request({
    url: '/user/get-user-info',
    method: 'get',
  })
}
