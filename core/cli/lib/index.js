'use strict'

module.exports = NaviCLI

const core = require('@navi-cli/core')

const PKG = require('../package.json')

function NaviCLI() {
  const program = core(PKG)
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(function () {
      console.log(arguments)
    })

  program.parse(process.argv)
}
