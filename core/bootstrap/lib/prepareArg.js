const path = require('path')

const userHome = require('user-home')

function getCacheLocal(isCahel = true) {
  const { NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES } = process.env
  const chaheLocal = path.resolve(
    userHome,
    NAVI_CACHE_DIR,
    isCahel ? NAVI_CACHE_DEPENDENCIES : `_${NAVI_CACHE_DEPENDENCIES}`
  )
  return chaheLocal
}

function isCache() {
  return process.env.NAVI_CACHE === '1'
}

function isUseLatestPackage() {
  return process.env.NAVI_LATEST === '1'
}

module.exports = {
  isCache,
  isUseLatestPackage,
  getCacheLocal,
}
