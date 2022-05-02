import axios from 'axios'
import { message } from 'antd'

const instance = axios.create({
  baseURL: '/ui',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1 << 14,
})

instance.interceptors.request.use(
  (config) => {
    if (!config?.headers) {
      throw new Error('Expected "config" and "config.headers" not to be undefined')
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
  },
  (error) => {
    message.error('请求失败!')
    Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 201) {
      message.error(response.data.err)
      return Promise.reject('error')
    }
    return response.data
  },
  (error) => {
    message.error('请求失败!')
    Promise.reject(error)
  },
)

export default instance
