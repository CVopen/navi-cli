'use strict'

module.exports = bootstrap

const path = require('path')

// const { print } = require('@navi-cli/log')
const Package = require('@navi-cli/package')
const exec = require('@navi-cli/exec')

const { isCache, isUseLatestPackage, isLcalDebug, getCacheLocal } = require('./prepareArg')

async function bootstrap(options) {
  const commandName = options.command.name()
  const packageName = options.packageName

  let targetPath = isLcalDebug(commandName)

  let pkg = null
  if (targetPath) {
    pkg = new Package({ targetPath })
    exec(pkg.getPkgPath(isLcalDebug(commandName), options))
    return
  }

  let chaheLocal = getCacheLocal(isCache())
  targetPath = chaheLocal
  chaheLocal = path.resolve(targetPath, 'node_modules')

  if (isCache()) {
    // 需要缓存
    if (isUseLatestPackage()) {
      // 使用最新包
      pkg = new Package({ targetPath, chaheLocal, packageName })
      if (await pkg.exists()) {
        // 使用
        console.log('存在')
      } else {
        // 更新
      }
    } else {
      // 不需要
      pkg = new Package({ targetPath, chaheLocal, packageName })
      // 判断本地是否存在包 不存在需要下载 存在则直接执行
      if (await pkg.exists(false)) {
        // 使用
        console.log('存在')
      } else {
        // 下载
        pkg.install()
      }
    }
  } else {
    // 不需要缓存
    pkg = new Package({ targetPath, chaheLocal, packageName, packageVersion: 'latest' })
  }
  exec(pkg.getPkgPath(), options)
}
