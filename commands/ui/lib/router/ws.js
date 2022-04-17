const { print } = require('@navi-cli/log')

const handleMethod = require('../controller/ws')

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
