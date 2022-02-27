const path = require('path')

const userHome = require('user-home')

function isCache() {
  return process.env.NAVI_CACHE === '1'
}

function isUseLatestPackage() {
  return process.env.NAVI_LATEST === '1'
}

function isLcalDebug(cmd) {
  const ENV_NAME = 'NAVI_DEBUG_PKG_PATH_' + cmd.toUpperCase()
  return process.env[ENV_NAME]
}

function getCacheLocal(isCahel = true) {
  const { NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES } = process.env
  const chaheLocal = path.resolve(
    userHome,
    NAVI_CACHE_DIR,
    isCahel ? NAVI_CACHE_DEPENDENCIES : `_${NAVI_CACHE_DEPENDENCIES}`
  )
  return chaheLocal
}

module.exports = {
  isCache,
  isUseLatestPackage,
  isLcalDebug,
  getCacheLocal,
}
