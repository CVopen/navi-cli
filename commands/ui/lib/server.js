const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const { print } = require('@navi-cli/log')

const expressWs = require('express-ws')
module.exports = server

function server() {
  print('info', 'Starting GUI...')
  const app = express()
  expressWs(app)

  staticRoute(app)
  require('./router')(app)

  app.use(express.json())
  app.use(
    history({
      rewrites: [{ from: /^\/ui\/.*$/, to: ({ parsedUrl: { path } }) => path }],
    })
  )
  app.use(express.static(path.join(__dirname, 'static')))

  app.listen(8888, () => print('info', ' Ready on http://localhost:8888'))
}

function staticRoute(app) {
  app.get('/', (_, res) => {
    res.redirect('/select')
  })
  app.get('/select', (_, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'))
  })
  app.get('/sub-react', (_, res) => {
    res.sendFile(path.join(__dirname, 'static/sub-react/index.html'))
  })
}
