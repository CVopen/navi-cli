'use strict'

module.exports = bootstrap

const path = require('path')

const { print } = require('@navi-cli/log')

const userHome = require('user-home')
const pathExists = require('path-exists').sync

const { prepareArg, isCache, isUseLatestPackage, isLcalDebug } = require('./prepareArg')

function bootstrap(options) {
  const execPkg = options.execPkgName
  options = prepareArg(options)
  const { NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES } = process.env
  const chaheLocal = path.resolve(userHome, NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES)
  print('verbose', 'execPkg', execPkg, 'red')
  print('verbose', 'chaheLocal', chaheLocal, 'red')

  console.log(isLcalDebug())
  const [isDebug, pkgPath] = isLcalDebug()
  if (isDebug) {
    if (!pathExists(pkgPath)) {
      print('error', 'target package does not exist', 'red')
      process.exit(1)
    }
    return
  }

  if (isCache()) {
    if (isUseLatestPackage()) {
      return
    } else {
      return
    }
  } else {
    return
  }
}
