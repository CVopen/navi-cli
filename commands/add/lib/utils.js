const path = require('path')

const userHome = require('user-home')

const { TEMPLATE_JSON, COMMAND_JSON, COMMAND } = require('./const')

module.exports = {
  getTemplateLocalPath,
  getCommandLocalPath,
  getList,
  createPromptList,
}

function getTemplateLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, TEMPLATE_JSON)
}

function getCommandLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, COMMAND_JSON)
}

function getList(type = COMMAND) {
  return require(type === COMMAND ? getCommandLocalPath() : getTemplateLocalPath())
}

function createPromptList(paramsList) {
  return paramsList.map(({ name, message, tip, type, choices }) => ({
    type: type || 'input',
    name,
    message,
    choices,
    validate(v) {
      if (!tip) return true
      const done = this.async()
      const _validate = () => {
        if (!v.trim()) return done(tip)
        done(null, true)
      }
      setTimeout(_validate)
    },
  }))
}
