const path = require('path')

const userHome = require('user-home')

const { TEMPLATE_JSON, PROJECT_JSON } = require('./const')

function getTemplateLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, TEMPLATE_JSON)
}

function getProjectLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, PROJECT_JSON)
}

function getCachePath() {
  const targetPath = path.resolve(userHome, process.env.NAVI_CACHE_DIR, process.env.NAVI_CACHE_TEMPLATE)
  const chaheLocal = path.resolve(targetPath, 'node_modules')
  return { targetPath, chaheLocal }
}

function getTemplate() {
  return require(getTemplateLocalPath())
}

module.exports = {
  getTemplate,
  getCachePath,
  getProjectLocalPath,
}
