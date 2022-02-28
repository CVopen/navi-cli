'use strict'

module.exports = bootstrap

const path = require('path')

const { print } = require('@navi-cli/log')
const Package = require('@navi-cli/package')
const { isCache, isUseLatestPackage, getCacheLocal } = require('./prepareArg')

const execa = require('execa')
const fse = require('fs-extra')

async function bootstrap(options) {
  const packageName = options.packageName

  let targetPath = options.local

  let pkg = null
  if (targetPath) {
    pkg = new Package({ targetPath })
    exec(pkg.getPkgPath(options.local), options)
    return
  }

  let chaheLocal = getCacheLocal(isCache())
  targetPath = chaheLocal
  chaheLocal = path.resolve(targetPath, 'node_modules')

  pkg = new Package({ targetPath, chaheLocal, packageName })
  if (isCache()) {
    if (!(await pkg.exists(isUseLatestPackage()))) {
      await pkg.install()
    }
  } else {
    options.clear = true
    options.targetPath = targetPath
    await pkg.install()
  }
  exec(pkg.getPkgPath(), options)
}

function exec(execPkgPath, options) {
  const clear = options.clear
  const targetPath = options.targetPath
  options = init(options)

  // 执行
  const code = `require('${execPkgPath}')(${JSON.stringify(options)})`
  const child = execa('node', ['-e', code], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
  child.on('error', (err) => {
    print('error', err.message, 'red')
  })
  child.on('exit', () => {
    if (!clear) return
    fse.remove(targetPath)
  })
}

function init(options) {
  const command = Object.create(null)
  Object.keys(options.command).forEach((key) => {
    if (key.startsWith('_') || key === 'parent') return
    command[key] = options.command[key]
  })
  options.command = command
  delete options.packageName
  delete options.clear
  delete options.targetPath
  return options
}
