import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取图片
export function fetchList(params) {
  return request({
    url: `${baseURL}/swiper/list`, // 请求接口
    method: 'get'
  })
}

// 删除图片
export function del(params) {
  return request({
    params,
    url: `${baseURL}/swiper/del`,
    method: 'get'
  })
}
