const open = require('@navi-cli/open')
const { print } = require('@navi-cli/log')

const { accessSync, constants, writeFileSync } = require('fs')

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'project.json'

module.exports = { getList, openFold }

const local = getLocal(CUSTOM_FILE_NAME)

function getList() {
  try {
    accessSync(local, constants.F_OK)
  } catch (error) {
    writeFileSync(local, '[]')
  }
  delete require.cache[require.resolve(local)]
  return require(local)
}

function openFold({ local }) {
  return new Promise((resolve) => {
    const exec = open(local)
    exec.on('exit', (code) => {
      if (code != 0) {
        print('error', `Open folder '${local}' fail, exit code '${code}'`)
      }
      resolve(code)
    })
  })
}
