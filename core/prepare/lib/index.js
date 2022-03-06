'use strict'

module.exports = prepare

const path = require('path')

const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const dedent = require('dedent')
const fse = require('fs-extra')

const { print } = require('@navi-cli/log')
const { getPackageVersions } = require('@navi-cli/request')
const { getIsLatestVersion } = require('@navi-cli/utils')

const ENV_FILE_NAME = 'navi-cli.env'

async function prepare(pkg) {
  try {
    await checkVersion(pkg)
    checkRoot()
    checkUserHome()
    checkEnv()
  } catch (error) {
    print('error', error.message, 'red')
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
  const currentVersion = pkg.version,
    npmName = pkg.name,
    res = await getPackageVersions(npmName),
    latestVersion = getIsLatestVersion(res, currentVersion)
  if (!latestVersion) return print('notice', 'cli version', currentVersion)

  print(
    'warn',
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
    dotenvPath = path.resolve(userHome, ENV_FILE_NAME),
    isExists = pathExists(dotenvPath)

  if (!isExists) {
    let content = ''
    Object.keys(env).forEach((key) => (content += `${key}=${env[key]} \n`))
    fse.outputFileSync(dotenvPath, content)
  }
  require('dotenv').config({
    path: dotenvPath,
  })

  if (!isExists) {
    Object.keys(env).forEach((key) => {
      if (!process.env[key]) {
        process.env[key] = env[key]
      }
    })
  }
}
