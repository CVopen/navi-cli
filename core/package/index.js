'use strict'

const path = require('path')

const { print } = require('@navi-cli/log')
const { formatPath } = require('@navi-cli/utils')

const pkgDir = require('pkg-dir').sync
// const npminstall = require('npminstall')

class Package {
  constructor(options) {
    this.targetPath = options.targetPath
    this.chaheLocal = options.storechaheLocalDir
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion

    print('verbose', 'options', options)
  }

  getDebugPkgPath() {
    const dir = pkgDir(this.targetPath)
    if (!dir) {
      print('error', 'target package does not exist', 'red')
      process.exit(1)
    }
    const pkg = require(path.resolve(dir, 'package.json'))
    if (pkg && pkg.main) {
      return formatPath(path.resolve(dir, pkg.main))
    }
    return formatPath(dir)
  }

  install() {
    // npminstall({
    //   root: this.
    // })
  }
}

module.exports = Package

// exec
