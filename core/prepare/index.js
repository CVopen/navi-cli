'use strict'

module.exports = prepare

const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync

const log = require('@navi-cli/log')
const { get } = require('@navi-cli/request')

async function prepare(pkg) {
  try {
    await exec(pkg)
  } catch (error) {
    log.error(error.message)
    return true
  }
}

async function exec(pkg) {
  version(pkg)
  await checkVersion(pkg)
  checkRoot()
  checkUserHome()
}

function version(pkg) {
  log.notice('cli version', pkg.version)
}

function checkRoot() {
  require('root-check')()
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'))
  }
}

async function checkVersion(pkg) {
  const res = await get({ url: `/${pkg.name}` })
  console.log(Object.keys(res.versions))
}
