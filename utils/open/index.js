'use strict'

module.exports = open

function open(url) {
  const exec = require('child_process').exec
  switch (process.platform) {
    case 'win32':
      return exec(`start ${url}`)
    case 'darwin':
      return exec(`open ${url}`)
    default:
      return exec('xdg-open', [url])
  }
}
