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
    .option('-d, --debug', 'enable dubug mode', false)

  program.on('option:debug', function () {
    process.env.LOG_LEVEL = 'verbose'
    log.level = process.env.LOG_LEVEL
    log.verbose('debug')
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
