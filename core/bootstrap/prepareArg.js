function prepareArg(options) {
  const command = Object.create(null)
  Object.keys(options.command).forEach((key) => {
    if (key.startsWith('_') || key === 'parent') return
    command[key] = options.command[key]
  })
  options.command = command
  delete options.execPkgName
  return options
}

function isCache() {
  return process.env.NAVI_CACHE === '1'
}

function isUseLatestPackage() {
  return process.env.NAVI_LATEST === '1'
}

function isLcalDebug() {
  return [process.env.NAVI_LOCAL_DEBUG_PKG === '1', process.env.NAVI_DEBUG_PKG_PATH]
}

module.exports = {
  prepareArg,
  isCache,
  isUseLatestPackage,
  isLcalDebug,
}
