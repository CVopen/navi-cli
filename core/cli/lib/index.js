'use strict'

module.exports = naviCLI

const core = require('@navi-cli/core')
const prepare = require('@navi-cli/prepare')
const { isEmptyList } = require('@navi-cli/utils')

const PKG = require('../package.json')

async function naviCLI() {
  if (await prepare(PKG)) process.exit(1)

  const program = core(PKG)

  const command = [
    {
      cmd: ['init [projectName]', 'generate a new project from a template'],
      option: [['-f, --force', 'force initialization']],
      action() {
        console.log('command init')
      },
    },
    {
      cmd: ['vue', 'generate a new project from a vue-cli'],
      action() {
        console.log('command vue')
      },
    },
    {
      cmd: ['react', 'generate a new project from a create-react-app'],
      action() {
        console.log('command react')
      },
    },
  ]

  command.forEach(({ cmd, option, action }) => {
    let register = program.command(...cmd)
    if (isEmptyList(option)) {
      if (isEmptyList(option[0])) {
        option.forEach((op) => register.option(...op))
      } else {
        register.option(...option)
      }
    }
    register.action(action)
  })

  program.parse(process.argv)
}
