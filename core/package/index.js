'use strict'

const path = require('path')

const { print } = require('@navi-cli/log')
const { formatPath, getSortVersion } = require('@navi-cli/utils')
const { getPackageVersions } = require('@navi-cli/request')

const pkgDir = require('pkg-dir').sync
const npminstall = require('npminstall')
const pathExists = require('path-exists').sync

class Package {
  constructor(options) {
    this.targetPath = options.targetPath
    this.chaheLocal = options.chaheLocal
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion

    print('verbose', 'options', options)
  }

  getPkgPath(targetPath) {
    if (!targetPath) {
      targetPath = this._getPkgLocal()
    }
    const dir = pkgDir(targetPath)
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
    npminstall({
      root: this.targetPath,
      storeDir: this.chaheLocal,
      registry: process.env.NAVI_BASE_URL,
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    })
  }

  async exists(isUseLatest = true) {
    const res = await getPackageVersions(this.packageName)
    console.log(res)
    return this._exists(res, isUseLatest)
  }

  _exists(versions, isUserLatest) {
    versions = getSortVersion(versions)
    if (isUserLatest) {
      this.packageVersion = versions[0]
      return pathExists(this._getPkgLocal(versions[0]))
    } else {
      return versions.some((version) => {
        this.packageVersion = version
        return pathExists(this._getPkgLocal(version))
      })
    }
  }

  _getPkgLocal(version = this.packageVersion) {
    // @navi-cli/init -> _@navi-cli_init@1.0.3@@navi-cli
    // userhome -> _userhome@1.0.0@userhome
    if (this.packageName.startsWith('@')) {
      const cacheName = this.packageName.replace('/', '_')
      const nameArr = this.packageName.split('/')
      return path.resolve(this.chaheLocal, `_${cacheName}@${version}@${nameArr[0]}`, nameArr[1])
    } else {
      console.log(this.chaheLocal)
      return path.resolve(this.chaheLocal, `_${this.packageName}@${version}@${this.packageName}`)
    }
  }
}

module.exports = Package
