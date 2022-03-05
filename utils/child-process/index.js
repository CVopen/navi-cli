'use strict'

const { ValidationError } = require('@navi-cli/log')

const execa = require('execa')

function mergeOptions(opts) {
  return Object.assign({}, opts, { stdio: 'inherit' })
}

function exec(command, args, opts) {
  opts = mergeOptions(opts)
  const child = execa(command, args, opts)
  child.on('error', (err) => {
    throw new ValidationError('red', err.message)
  })

  return child
}

function execSync(command, args, opts) {
  return execa.sync(command, args, mergeOptions(opts)).stdout
}

module.exports = {
  exec,
  execSync,
}
