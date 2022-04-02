import axios, {AxiosRequestConfig} from 'axios'
import { message } from 'antd'

const instance = axios.create({
  baseURL: '/ui',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    if (!config?.headers) {
      throw new Error('Expected \'config\' and \'config.headers\' not to be undefined')
    }
    config.headers.Authorization= `Bearer ${localStorage.getItem('token')}`
    return config
  },
  (error) => Promise.reject(error)
)
 
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) =>  Promise.reject(error)
)

export default instance