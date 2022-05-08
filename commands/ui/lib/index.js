'use strict'

const server = require('./server')
module.exports = server

if (process.env.NODE_ENV === 'development') server()
