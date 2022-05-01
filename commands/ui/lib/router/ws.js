const fse = require('fs-extra')
const { print } = require('@navi-cli/log')

const handleMethod = require('../controller/ws')
const { getLocal } = require('../utils')
const { NAVI_CACHE_TEMPLATE } = require('../constant')

module.exports = connect

function connect(app) {
  app.ws('/ws', (ws) => {
    print('info', 'ws connect success')
    ws.send('connect to express server with WebSocket success')

    ws.on('message', function (msg) {
      msg = JSON.parse(msg)
      handleMethod[msg.type](msg.data, ws)
    })
  })
}

process.on('SIGINT', () => {
  fse.remove(getLocal(NAVI_CACHE_TEMPLATE))
  process.exit(0)
})
