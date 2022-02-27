'use strict'

module.exports = bootstrap

const path = require('path')

const { print } = require('@navi-cli/log')
const Package = require('@navi-cli/package')

const { prepareArg, isCache, isUseLatestPackage, isLcalDebug, getCacheLocal } = require('./prepareArg')

function bootstrap(options) {
  const commandName = options.command.name()
  const packageName = options.packageName
  options = prepareArg(options)

  print('verbose', 'options', options)

  let targetPath = isLcalDebug(commandName)

  let pkg = null
  if (targetPath) {
    pkg = new Package({ targetPath })
  }

  let chaheLocal = getCacheLocal(isCache())
  targetPath = chaheLocal
  chaheLocal = path.resolve(targetPath, 'node_modules')

  if (isCache()) {
    // 需要缓存
    if (isUseLatestPackage()) {
      // 使用最新包
    } else {
      // 不需要
    }
  } else {
    // 不需要缓存
    pkg = new Package({ targetPath, chaheLocal, packageName, packageVersion: 'latest' })
  }
  const execPkgPath = pkg.getDebugPkgPath()

  print('verbose', 'execPkgPath', execPkgPath, 'cyan')
}
