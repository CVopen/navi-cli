'use strict'

module.exports = naviCLI

const core = require('@navi-cli/core')
const prepare = require('@navi-cli/prepare')

const PKG = require('../package.json')

async function naviCLI() {
  if (await prepare(PKG)) process.exit()

  const program = core(PKG)
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(function () {
      // console.log(arguments)
      console.log('init')
    })

  program.parse(process.argv)
}
