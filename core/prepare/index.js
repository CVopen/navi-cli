'use strict'

module.exports = prepare

const path = require('path')

const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const dedent = require('dedent')
const fse = require('fs-extra')

const log = require('@navi-cli/log')
const { getPackageVersions } = require('@navi-cli/request')
const { getLatestVersion } = require('@navi-cli/utils')

const ENV_FILE_NAME = 'navi-cli.env'

async function prepare(pkg) {
  if (process.argv.length <= 2) {
    log.error('cli', 'A command is required. Pass --help to see all available commands and options.')
    process.exit(1)
  }
  try {
    await checkVersion(pkg)
    checkRoot()
    checkUserHome()
    checkEnv()
  } catch (error) {
    log.error(error.message)
    return true
  }
}

function checkRoot() {
  require('root-check')()
}

function checkUserHome() {
  log.info('userhome', userHome)
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在!'))
  }
}

async function checkVersion(pkg) {
  const currentVersion = pkg.version,
    npmName = pkg.name,
    res = await getPackageVersions(npmName),
    latestVersion = getLatestVersion(res, currentVersion)

  if (!latestVersion) return log.notice('cli version', currentVersion)

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

function checkEnv() {
  const env = require('./consts'),
    dotenvPath = path.resolve(userHome, ENV_FILE_NAME)
  if (!pathExists(dotenvPath)) {
    let content = ''
    Object.keys(env).forEach((key) => (content += `${key}=${env[key]} \n`))
    fse.outputFileSync(dotenvPath, content)
  }
  require('dotenv').config({
    path: dotenvPath,
  })
}
