const path = require('path')

const userHome = require('user-home')
const { getCacheDir } = require('../utils')
const CUSTOM_FILE_NAME = 'command.json'

module.exports = { getList }

function _getLocalJson() {
  return require(path.join(userHome, getCacheDir(), CUSTOM_FILE_NAME))
}

function getList() {
  return _getLocalJson()
}
