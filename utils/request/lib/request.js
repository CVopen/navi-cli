'use strict'

const axios = require('axios')

const { getBaseUrl } = require('@navi-cli/utils')

const request = axios.create({
  baseURL: getBaseUrl(),
  timeout: 6000,
})

request.interceptors.request.use(
  (config) => config,
  (err) => Promise.resolve(err)
)

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    }
    return Promise.resolve()
  },
  (err) => Promise.resolve(err)
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
