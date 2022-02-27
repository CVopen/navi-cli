'use strict'

const axios = require('axios')

const request = axios.create({
  baseURL: process.env.NAVI_BASE_URL || 'https://registry.npmjs.org',
  timeout: 6000,
})

request.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
)

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    }
    return Promise.resolve()
  },
  (err) => Promise.reject(err)
)

const get = ({ url, params, headers = {} }) => {
  return request.request({
    url,
    headers,
    params,
  })
}

module.exports = {
  get,
}
