'use strict'

const uiServer = require('./server')
module.exports = uiServer

if (process.env.NODE_ENV === 'development') {
  uiServer()
}
