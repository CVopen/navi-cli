const fs = require('fs')

module.exports = router

function router(app) {
  fs.readdir(__dirname, function (err, files) {
    if (err) return console.log('Error', err)
    files.forEach((fileName) => {
      if (fileName === 'index.js') return
      if (fileName === 'ws.js') {
        require(`./${fileName}`)(app)
      } else {
        app.use(require(`./${fileName}`))
      }
    })
  })
}
