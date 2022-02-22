'use strict'

module.exports = core

const colors = require('colors/safe')
const { Command } = require('commander')

const log = require('@navi-cli/log')

function core(pkg) {
  const program = new Command()

  program
    .name('navi')
    .usage('<command> [options]')
    .version(pkg.version, '-v, --version', 'output the current version')
    .option('-c, --cache', 'turn off cache mode', true)

  if (process.env.NAVI_LOG_LEVEL === 'verbose') {
    log.level = process.env.NAVI_LOG_LEVEL
    log.verbose('you are in debug mode')
  }

  program.on('option:cache', function () {
    process.env.NAVI_CACHE = '0'
  })

  program.on('command:*', function (errCommand) {
    program.outputHelp()
    console.log()
    log.error(colors.red(`未知的命令: ${errCommand[0]}`))
    if (program.commands.length === 0) return
    const echoCommands = program.commands.map((cmd) => cmd.name())
    log.info(colors.red(`可用命令: ${echoCommands}`))
  })

  return program
}
