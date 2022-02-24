'use strict'

module.exports = naviCLI

const core = require('@navi-cli/core')
const prepare = require('@navi-cli/prepare')
const { isEmptyList } = require('@navi-cli/utils')
const bootstrap = require('@navi-cli/bootstrap')
const { print } = require('@navi-cli/log')

const generateCommand = require('./command')

const PKG = require('../package.json')

async function naviCLI() {
  print('test')
  if (await prepare(PKG)) process.exit(1)

  const { commandList, INSIDE_CMD } = generateCommand()

  const program = core(PKG)

  commandList.forEach((item, index) => {
    checkCmd(item.cmd, index, INSIDE_CMD)
    registerCommand(item, index, program)
  })

  program.parse(process.argv)
}

function registerCommand({ cmd, option, description, execPkgName }, index, program) {
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

  register.action(function () {
    const commandArg = [...arguments],
      command = commandArg.pop(),
      args = commandArg.pop()
    const params = {
      cmds: commandArg,
      args,
      command,
      execPkgName,
    }
    bootstrap(params)
  })
}

function checkCmd(cmd, index, INSIDE_CMD) {
  if (!cmd || typeof cmd !== 'string') {
    print('error', 'command.json: cmd is not a string', 'red')
    process.exit(1)
  }

  if (index >= INSIDE_CMD.length && INSIDE_CMD.includes(cmd.split(' ')[0])) {
    print('error', `command.json: '${cmd}' is already occupied`, 'red')
    process.exit(1)
  }
}
