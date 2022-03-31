const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const { print } = require('@navi-cli/log')

module.exports = server

function server() {
  print('info', 'Starting GUI...')
  const app = express()

  app.all('*', function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Headers', 'Content-Type')
    // res.header('Access-Control-Allow-Methods', '*')
    // res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })

  app.get('/', function (_, res) {
    res.redirect('/select')
  })

  app.get('/select', function (_, res) {
    res.type('html')
    res.sendFile(path.join(__dirname, 'static/index.html'))
  })

  app.get('/sub-react', function (_, res) {
    res.type('html')
    res.sendFile(path.join(__dirname, 'static/sub-react/index.html'))
  })

  app.use(history())

  app.use(express.static(path.join(__dirname, 'static')))

  app.listen(8888, function () {
    print('info', ' Ready on http://localhost:8888')
  })
}
