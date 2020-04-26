// 博客管理 数据交互
import request from '@/utils/request' // request.js为是基于axios封装好的请求方法
const baseURL = 'http://localhost:3000' // 后端请求接口

// 获取博客列表数据
export function fetchList(params) {
  return request({
    url: `${baseURL}/blog/list`,
    method: 'get',
    params: {
      ...params
    }
  })
}

// 删除博客
export function del(params) {
  return request({
    url: `${baseURL}/blog/del`,
    data: {
      ...params
    },
    method: 'post'
  })
}
