'use strict'

const axios = require('axios')

const request = axios.create({
  baseURL: process.env.NAVI_BASE_URL || 'https://registry.npmjs.org',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => config,
  (err) => {
    throw new Error(err)
  }
)

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    }
    return Promise.resolve()
  },
  (err) => {
    throw new Error(err)
  }
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
