'use strict'

const log = require('npmlog')
const colors = require('colors/safe')

log.heading = 'navi-cli'
log.addLevel('success', 2000, { fg: 'green', bold: true })

const COLORS = ['rainbow', 'grey', 'cyan', 'grey', 'green', 'grey', 'cyan', 'yellow', 'blue', 'red']
const TYPES = ['info', 'http', 'error', 'notice', 'warn', 'verbose']

/**
 * @param {*} type ['info', 'http', 'error', 'notice', 'warn', 'verbose']
 * @param {*} message one or more
 * @param {*} color ['rainbow', 'grey', 'cyan', 'grey', 'green', 'grey', 'cyan', 'yellow', 'blue', 'red']
 */
function print() {
  const args = [...arguments]
  const type = args.shift()
  if (!TYPES.includes(type)) {
    log.error(colors.red('print function type: ', TYPES))
    process.exit(1)
  }
  let color
  if (COLORS.includes(args[args.length - 1])) {
    color = args.pop()
  }
  logs(type, args, color)
}

function logs(type = 1, message, color) {
  if (color) {
    log[type](colors[color](...message))
  } else {
    log[type](...message)
  }
}

module.exports = {
  log,
  print,
}
