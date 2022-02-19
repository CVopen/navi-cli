'use strict'

module.exports = cli

const core = require('@open-cli/core')

function cli() {
  const b = 'dsf '

  console.log(core(), b)
  return 'cli'
}

cli()
