const { NAVI_CACHE_DIR, SUCCESS_CODE, SUCCESS_TEXT, ERROR_TEXT, ERROR_CODE } = require('../constant')

const path = require('path')

const userHome = require('user-home')

function sendData(data = {}, err = '') {
  return {
    code: !err ? SUCCESS_CODE : ERROR_CODE,
    data,
    msg: !err ? SUCCESS_TEXT : ERROR_TEXT,
    err: err,
  }
}

function getCacheDir() {
  if (process.env.NODE_ENV === 'development') {
    return NAVI_CACHE_DIR
  }
  return process.env.NAVI_CACHE_DIR
}

function getLocal(filename) {
  return path.join(userHome, getCacheDir(), filename)
}

module.exports = {
  getCacheDir,
  sendData,
  getLocal,
}
