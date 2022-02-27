'use strict'

module.exports = open

function open(url) {
  const exec = require('child_process').exec
  switch (process.platform) {
    case 'win32':
      exec(`start ${url}`)
      break
    case 'darwin':
      exec(`open ${url}`)
      break
    default:
      exec('xdg-open', [url])
  }
}
