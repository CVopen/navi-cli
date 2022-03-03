'use strict'

const { ValidationError } = require('@navi-cli/log')

const execa = require('execa')

function exec(command, args, opts) {
  const options = Object.assign({}, opts, { stdio: 'inherit' })
  const child = execa(command, args, options)
  child.on('error', (err) => {
    throw new ValidationError('red', err.message)
  })

  return child
}

function execSync(command, args, opts) {
  const options = Object.assign({}, opts, { stdio: 'inherit' })
  return execa.sync(command, args, options).stdout
}

module.exports = {
  exec,
  execSync,
}
