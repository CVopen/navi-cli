import instance from './instance'

interface ResType<T> {
  code: number
  data?: T
  msg: string
  err?: string
}

type Http = <T>(
  url: string, 
  params?: unknown
) => Promise<ResType<T>>


export const get: Http = (url, params) => {
  return instance.get(url, { params })
}

export const post: Http = (url, params) => {
  return instance.post(url, params)
}

export const del: Http = (url, params) => {
  return instance.delete(url, {params})
}

export const put: Http = (url, params) => {
  return instance.put(url, params)
}