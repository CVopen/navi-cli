'use strict'

module.exports = factory

const path = require('path')

const { ValidationError } = require('@navi-cli/log')
const Package = require('@navi-cli/package')
const { execSync } = require('@navi-cli/child-process')

const validate = require('validate-npm-package-name')
const inquirer = require('inquirer')
const fse = require('fs-extra')

const { getTemplate, getCachePath } = require('./template')

function factory(options) {
  return new Init(options)
}

class Init {
  constructor(options) {
    let chain = Promise.resolve()
    chain = chain.then(this.initialize.bind(this, options))
    chain = chain.then(this.prepare.bind(this))
    chain = chain.then(this.slectTemplate.bind(this))
    chain = chain.then(this.downloadTemplate.bind(this))
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
    this.projectName = options.cmds[0]
    this.force = options.args.force
    this.template = getTemplate()
    this.projectPath = path.resolve(process.cwd(), this.projectName)
  }

  async prepare() {
    const localPath = process.cwd()
    if (!this.force) return
    const result = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmDelete',
      default: false,
      message: 'Empty directory?',
    })

    if (!result.confirmDelete) return
    fse.emptyDirSync(localPath)
  }

  async slectTemplate(choices) {
    if (!choices) {
      choices = this.template
    }
    choices = choices.map((item) => ({ name: item.label, value: item.name }))
    return (
      await inquirer.prompt({
        type: 'list',
        name: 'projectTemplate',
        message: '请选择项目模板',
        choices,
      })
    ).projectTemplate
  }

  async downloadTemplate(packageName) {
    const { targetPath, chaheLocal } = getCachePath()
    this.pkg = new Package({
      packageName,
      targetPath,
      chaheLocal,
    })
    if (!(await this.pkg.exists())) {
      await this.pkg.install()
    }
  }

  execute() {
    const templatePath = path.resolve(this.pkg.getPkgPath(), '../template')
    fse.copySync(templatePath, this.projectPath)
    execSync('npm', ['install'], { cwd: this.projectPath })
    execSync('npm', ['run', 'serve'], { cwd: this.projectPath })
  }
}
