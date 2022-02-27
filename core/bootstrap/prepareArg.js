const path = require('path')

const userHome = require('user-home')

function prepareArg(options) {
  const command = Object.create(null)
  Object.keys(options.command).forEach((key) => {
    if (key.startsWith('_') || key === 'parent') return
    command[key] = options.command[key]
  })
  options.command = command
  delete options.execPkgName
  return options
}

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
  prepareArg,
  isCache,
  isUseLatestPackage,
  isLcalDebug,
  getCacheLocal,
}
