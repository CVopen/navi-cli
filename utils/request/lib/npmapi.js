const { get } = require('./request')

function getPackage(pkgName) {
  return get({ url: `/${pkgName}` })
}

function getPackageVersions(pkgName) {
  return getPackage(pkgName).then((res) => Object.keys(res.versions || {}))
}

module.exports = {
  getPackage,
  getPackageVersions,
}
