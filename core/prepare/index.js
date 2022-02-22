'use strict'

module.exports = prepare

const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const dedent = require('dedent')

const log = require('@navi-cli/log')
const { getPackageVersions } = require('@navi-cli/request')
const { getLatestVersion } = require('@navi-cli/utils')

async function prepare(pkg) {
  try {
    await checkVersion(pkg)
    checkRoot()
    checkUserHome()
  } catch (error) {
    log.error(error.message)
    return true
  }
}

function checkRoot() {
  require('root-check')()
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在!'))
  }
}

async function checkVersion(pkg) {
  const currentVersion = pkg.version
  const npmName = pkg.name
  const res = await getPackageVersions(npmName)
  const latestVersion = getLatestVersion(res, currentVersion)

  if (!latestVersion) {
    return log.notice('cli version', currentVersion)
  }

  log.warn(
    'cli updated',
    colors.yellow(
      dedent`
        navi has a new version(npm install -g ${npmName})
        current: ${currentVersion}, latest: ${latestVersion}
      `
    )
  )
}
