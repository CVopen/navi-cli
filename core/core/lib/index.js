'use strict'

module.exports = core

const colors = require('colors/safe')
const { Command } = require('commander')
const dedent = require('dedent')

const { print, log } = require('@navi-cli/log')

function core(pkg) {
  const program = new Command()

  program
    .name('navi')
    .usage('<command> [options]')
    .version(pkg.version, '-v, --version', 'output the current version')
    .option('-c, --cache', 'turn off cache mode', true)
    .option('-l, --latest', 'execute with the latest package', false)

  if (process.env.NAVI_LOG_LEVEL === 'verbose') {
    log.level = process.env.NAVI_LOG_LEVEL
    print('verbose', 'you are in debug mode', 'red')
  }

  program.on('option:cache', function () {
    process.env.NAVI_CACHE = '0'
  })

  program.on('option:latest', function () {
    process.env.NAVI_LATEST = '1'
  })

  program.on('command:*', function (errCommand) {
    program.outputHelp()
    print('error', `unknown command: ${errCommand[0]}`, 'red')
    if (program.commands.length === 0) return
    const echoCommands = program.commands.map((cmd) => cmd.name())
    print('error', `available commands: ${echoCommands}`, 'red')
  })

  program.addHelpText(
    'after',
    colors.green(dedent`
    epilogue:

      For more information, find our manual at https://github.com/CVopen/navi-cli
  `)
  )

  return program
}
