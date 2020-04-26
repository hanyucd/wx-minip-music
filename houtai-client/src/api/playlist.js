import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取歌单列表数据
export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/playlist/list`,
    method: 'get'
  })
}

// 获取单条歌单
export function fetchById(params) {
  return request({
    params,
    url: `${baseURL}/playlist/getById`,
    method: 'get'
  })
}

// 更新歌单
export function update(params) {
  return request({
    url: `${baseURL}/playlist/updatePlaylist`,
    data: {
      ...params
    },
    method: 'post'
  })
}

// 删除歌单
export function del(params) {
  return request({
    params,
    url: `${baseURL}/playlist/del`,
    method: 'get'
  })
}
