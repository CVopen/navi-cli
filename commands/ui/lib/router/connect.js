const { print } = require('@navi-cli/log')

module.exports = connect

function connect(app) {
  app.ws('/ws', (ws) => {
    print('info', 'connect success')
    ws.send('connect to express server with WebSocket success')
  })
}
