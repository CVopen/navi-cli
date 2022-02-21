'use strict'

const axios = require('axios')

const request = axios.create({
  baseURL: process.env.CLI_BASE_URL || 'https://registry.npmjs.org',
  timeout: 6000,
})

request.interceptors.response.use((response) => response.data)

const get = ({ url, params, headers = {} }) => {
  return request.request({
    method: 'get',
    url,
    headers,
    params,
  })
}

module.exports = {
  get,
}
