const open = require('@navi-cli/open')
const { print } = require('@navi-cli/log')

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'project.json'

module.exports = { getList, openFold }

const local = getLocal(CUSTOM_FILE_NAME)

function getList() {
  delete require.cache[require.resolve(local)]
  return require(local)
}

function openFold({ local }) {
  return new Promise((resolve) => {
    const exec = open(local)
    exec.on('exit', (code) => {
      if (!code) {
        print('error', `Open folder '${local}' fail`)
      }
      resolve(code)
    })
  })
}
