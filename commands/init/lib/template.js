const path = require('path')

const userHome = require('user-home')
const fse = require('fs-extra')

const { TEMPLATE_JSON, NAVI_TEMPLATE } = require('./const')

function getTemPlateLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, TEMPLATE_JSON)
}

function getCachePath() {
  const targetPath = path.resolve(userHome, process.env.NAVI_CACHE_DIR, process.env.NAVI_CACHE_TEMPLATE)
  const chaheLocal = path.resolve(targetPath, 'node_modules')
  return { targetPath, chaheLocal }
}

function getTemplate() {
  const localPath = getTemPlateLocalPath()
  if (!fse.pathExistsSync(localPath)) {
    fse.outputJsonSync(localPath, [])
  }
  return [...NAVI_TEMPLATE, ...require(localPath)]
}

module.exports = {
  getTemplate,
  getCachePath,
}
