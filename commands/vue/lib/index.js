'use strict'

module.exports = factory

const { execSync, exec } = require('@navi-cli/child-process')
const { ValidationError } = require('@navi-cli/log')
const open = require('@navi-cli/open')

const validate = require('validate-npm-package-name')
const ansiEscapes = require('ansi-escapes')
const inquirer = require('inquirer')

function factory(options) {
  return new Vue(options)
}

class Vue {
  constructor(options) {
    let chain = Promise.resolve()
    chain = chain.then(this.initialize.bind(this, options))
    chain = chain.then(this.validateExists.bind(this))
    chain = chain.then(this.installVueCLI.bind(this))
    chain = chain.then(this.openDocument.bind(this))
    chain = chain.then(this.execute.bind(this))
    chain.catch((err) => {
      throw new ValidationError('red', err.message)
    })
  }

  initialize(options) {
    const val = validate(options.cmds[0])
    if (val.errors) {
      throw new Error(val.errors)
    }
    this.args = options.command.args
    this.execPath = process.cwd()
  }

  validateExists() {
    try {
      execSync('vue', ['-V'], { cwd: this.execPath })
      process.stdout.write(ansiEscapes.eraseLines(2))
    } catch (error) {
      process.stdout.write(ansiEscapes.eraseLines(3))
      return true
    }
  }

  async installVueCLI(isInstall) {
    if (!isInstall) return
    const confirmInstall = (
      await inquirer.prompt({
        type: 'confirm',
        name: 'confirmInstall',
        default: true,
        message: '您未安装vue-cli, 是否安装?',
      })
    ).confirmInstall
    if (!confirmInstall) process.exit(0)
    execSync('npm', ['install', '-g', '@vue/cli'], { cwd: this.execPath })
  }

  async openDocument() {
    const isOpen = (
      await inquirer.prompt({
        type: 'confirm',
        name: 'isOpen',
        default: false,
        message: '是否需要打开vue-cli文档?',
      })
    ).isOpen
    if (!isOpen) return
    const position = (
      await inquirer.prompt({
        type: 'list',
        name: 'position',
        message: '请选择打开文档类型',
        choices: ['web', 'cmd'],
      })
    ).position
    if (position === 'web') {
      open('https://cli.vuejs.org/zh/')
    } else {
      execSync('vue', ['-h'], { cwd: this.execPath })
    }
  }

  execute() {
    exec('vue', this.args, { cwd: this.execPath })
  }
}
