'use strict'

module.exports = naviCLI

const core = require('@navi-cli/core')
const prepare = require('@navi-cli/prepare')
const { isEmptyList } = require('@navi-cli/utils')
const bootstrap = require('@navi-cli/bootstrap')

const generateCommand = require('./command')

const PKG = require('../package.json')

async function naviCLI() {
  if (await prepare(PKG)) process.exit(1)

  const program = core(PKG)

  generateCommand().forEach(({ cmd, option, description }) => {
    if (!cmd || typeof cmd !== 'string') {
      throw new Error('cmd is not a string')
    }

    let register = program.command(cmd)
    if (description && typeof description === 'string') {
      register.description(description)
    }
    if (isEmptyList(option)) {
      if (isEmptyList(option[0])) {
        option.forEach((op) => register.option(...op))
      } else {
        register.option(...option)
      }
    }
    register.action(bootstrap)
  })

  program.parse(process.argv)
}
