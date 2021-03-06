const express = require('express')
const path = require('path')

const history = require('connect-history-api-fallback')
const expressWs = require('express-ws')

const { print } = require('@navi-cli/log')
const open = require('@navi-cli/open')

const { PROT } = require('./constant')
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

  app.listen(PROT, () => {
    if (process.env.NODE_ENV !== 'development') {
      open(`http://localhost:${PROT}`)
    }
    print('info', `Ready on http://localhost:${PROT}`)
  })
}

function staticRoute(app) {
  app.get('/', (_, res) => {
    res.redirect('/select')
  })
  app.get('/select', (_, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'))
  })
  app.get('/react', (_, res) => {
    res.sendFile(path.join(__dirname, 'static/react/index.html'))
  })
}
