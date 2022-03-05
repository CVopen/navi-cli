'use strict'

const path = require('path')

const { ValidationError, print } = require('@navi-cli/log')
const { formatPath, getSortVersion } = require('@navi-cli/utils')
const { getPackageVersions } = require('@navi-cli/request')
const spinner = require('@navi-cli/spinner')

const pkgDir = require('pkg-dir').sync
const npminstall = require('npminstall')
const pathExists = require('path-exists').sync

class Package {
  constructor(options) {
    this.targetPath = options.targetPath
    this.chaheLocal = options.chaheLocal
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion

    print('verbose', 'Package options', options)
  }

  getPkgPath(targetPath) {
    if (!targetPath) {
      targetPath = this.getPkgLocal()
    }
    const dir = pkgDir(targetPath)
    if (!dir) {
      throw new ValidationError('red', 'target package does not exist')
    }
    const pkg = require(path.resolve(dir, 'package.json'))
    if (pkg && pkg.main) {
      return formatPath(path.resolve(dir, pkg.main))
    }
    return formatPath(dir)
  }

  async install() {
    if (!this.packageVersion) {
      const loading = spinner()
      const versions = await getPackageVersions(this.packageName)
      loading.stop()
      this.packageVersion = getSortVersion(versions)[0]
    }
    await npminstall({
      root: this.targetPath,
      storeDir: this.chaheLocal,
      registry: process.env.NAVI_BASE_URL,
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    })
  }

  async exists(isUseLatest = true) {
    const loading = spinner()
    const res = await getPackageVersions(this.packageName)
    loading.stop()
    return this._exists(res, isUseLatest)
  }

  _exists(versions, isUserLatest) {
    versions = getSortVersion(versions)
    if (isUserLatest) {
      this.packageVersion = versions[0]
      return pathExists(this.getPkgLocal(versions[0]))
    }
    const exist = versions.some((version) => {
      this.packageVersion = version
      return pathExists(this.getPkgLocal(version))
    })
    if (!exist) {
      this.packageVersion = versions[0]
    }
    return exist
  }

  getPkgLocal(version = this.packageVersion) {
    // @navi-cli/init -> _@navi-cli_init@1.0.3@@navi-cli
    // userhome -> _userhome@1.0.0@userhome
    if (this.packageName.startsWith('@')) {
      const cacheName = this.packageName.replace('/', '_')
      const nameArr = this.packageName.split('/')
      return path.resolve(this.chaheLocal, `_${cacheName}@${version}@${nameArr[0]}`, nameArr[1])
    }
    return path.resolve(this.chaheLocal, `_${this.packageName}@${version}@${this.packageName}`)
  }
}

module.exports = Package
