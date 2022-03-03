'use strict'

module.exports = bootstrap

const path = require('path')

const Package = require('@navi-cli/package')
const childProcess = require('@navi-cli/child-process')
const { isCache, isUseLatestPackage, getCacheLocal } = require('./prepareArg')

const fse = require('fs-extra')

async function bootstrap(options) {
  const packageName = options.packageName

  let targetPath = options.targetPath

  let pkg = null
  if (targetPath) {
    pkg = new Package({ targetPath })
    exec(pkg.getPkgPath(targetPath), options)
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
  const child = childProcess.exec('node', ['-e', code])
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
  return {
    cmds: options.cmds,
    args: options.args,
    command,
  }
}
