'use strict'

module.exports = factory

const { exec } = require('@navi-cli/child-process')
const { ValidationError } = require('@navi-cli/log')
const open = require('@navi-cli/open')

const validate = require('validate-npm-package-name')
const inquirer = require('inquirer')

function factory(options) {
  return new CRA(options)
}

class CRA {
  constructor(options) {
    let chain = Promise.resolve()
    chain = chain.then(this.initialize.bind(this, options))
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
    this.args = ['create-react-app', ...options.command.args]
    this.execPath = process.cwd()
  }

  async openDocument() {
    const isOpen = (
      await inquirer.prompt({
        type: 'confirm',
        name: 'isOpen',
        default: false,
        message: '是否需要打开Create React App 中文文档?',
      })
    ).isOpen
    if (!isOpen) return
    open('https://create-react-app.bootcss.com/')
  }

  execute() {
    exec('npx', this.args, { cwd: this.execPath })
  }
}
