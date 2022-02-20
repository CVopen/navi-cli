'use strict'

module.exports = cli

const core = require('@navi-cli/core')

function cli() {
  console.log(core())
  core()
  return 'cli'
}
