import axios from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 请求拦截：注入 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 响应拦截：统一错误处理
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.msg || err.message || '网络错误'
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      message.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
