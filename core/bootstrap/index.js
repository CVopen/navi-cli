'use strict'

module.exports = bootstrap

const path = require('path')

const log = require('@navi-cli/log')

const userHome = require('user-home')

function bootstrap(options) {
  const execPkg = options.execPkgName
  options = prepareArg(options)

  const { NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES } = process.env
  const chaheLocal = path.resolve(userHome, NAVI_CACHE_DIR, NAVI_CACHE_DEPENDENCIES)
  log.verbose('execPkg', execPkg)
  log.verbose('chaheLocal', chaheLocal)
}

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
