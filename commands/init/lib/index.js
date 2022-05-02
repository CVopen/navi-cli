'use strict'

module.exports = factory

const path = require('path')

const { ValidationError, print } = require('@navi-cli/log')
const Package = require('@navi-cli/package')
const { execSync } = require('@navi-cli/child-process')
const { isEmptyList } = require('@navi-cli/utils')

const validate = require('validate-npm-package-name')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const ejs = require('ejs')

const { getTemplate, getCachePath, getProjectLocalPath } = require('./utils')

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
    chain = chain.then(this.setting.bind(this))
    chain = chain.then(this.ejsRander.bind(this))
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
    this.git = options.args.git
    this.template = getTemplate()
    this.projectPath = path.resolve(process.cwd(), this.projectName)
  }

  async prepare() {
    if (!fse.pathExistsSync(this.projectPath)) {
      fse.emptyDirSync(this.projectPath)
      if (!this.git) {
        execSync('git', ['init'], { cwd: this.projectPath })
      }
      return
    }
    if (!this.force) {
      print('warn', 'A directory with the same name exists', 'yellow')
      process.exit = 0
    }
    const result = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmDelete',
      default: false,
      message: 'Empty directory?',
    })
    if (!result.confirmDelete) process.exit = 0
    fse.emptyDirSync(this.projectPath)
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

  async setting() {
    const { projectName, pkg } = this
    const mergeOption = (options = {}) => ({ ...options, projectName })
    const settingPath = path.resolve(pkg.getPkgLocal(), 'setting.json')

    if (!fse.pathExistsSync(settingPath)) return mergeOption()

    const settingJson = require(settingPath)
    if (!settingJson.ignore) settingJson.ignore = []
    if (!settingJson.template || !isEmptyList(settingJson.template)) return mergeOption(settingJson)

    const promptList = settingJson.template.map(({ name, message, tip }) => ({
      type: 'input',
      name,
      message,
      validate(v) {
        const done = this.async()
        const _validate = () => {
          if (!v) return done(tip)
          done(null, true)
        }
        setTimeout(_validate)
      },
    }))
    const project = await inquirer.prompt(promptList)
    return mergeOption({ ...project, ...settingJson })
  }

  ejsRander(setting) {
    const { pkg } = this,
      LRU = require('lru-cache'),
      templatePath = path.resolve(pkg.getPkgLocal(), 'template'),
      glob = require('glob'),
      options = {
        cwd: templatePath,
        nodir: true,
      }

    const _errorHandle = (err, message) => {
      if (err) {
        print('error', typeof message === 'string' ? message : err.message, 'red')
        ejs.clearCache()
        process.exit(1)
      }
    }
    const _globCallback = (resolve) => {
      return (err, files) => {
        _errorHandle(err, 'Failed to read template')
        ejs.cache = new LRU(files.length)
        const targetPath = Object.create(null)
        files.forEach((file) => {
          const filePath = path.join(templatePath, file)
          targetPath[filePath] = file
          ejs.renderFile(filePath, setting, { cache: true, async: true }, _errorHandle)
        })
        glob('**', options, (error, fileAll) => {
          _errorHandle(error, 'Failed to read template')
          const ignore = fileAll.filter((i) => !files.includes(i))
          resolve({ targetPath, setting, ignore })
        })
      }
    }
    if (!setting.ignore) setting.ignore = []
    return new Promise((resolve) =>
      glob('**', { ...options, ignore: [...setting.ignore, '**/*.html'] }, _globCallback(resolve))
    )
  }

  execute({ targetPath, setting, ignore }) {
    console.log({ targetPath, setting, ignore })
    ignore.forEach((file) => {
      const target = path.join(this.projectPath, file)
      const current = path.join(path.resolve(this.pkg.getPkgLocal(), 'template'), file)
      fse.copySync(current, target)
    })

    const cacheSize = ejs.cache.max
    let count = 0
    ejs.cache.forEach((value, key) => {
      const target = path.join(this.projectPath, targetPath[key])
      value(setting).then((res) => {
        fse.ensureFileSync(target)
        fse.writeFileSync(target, res)
        count++
        if (count !== cacheSize) return

        ejs.clearCache()

        const projectPath = getProjectLocalPath()
        if (!fse.pathExistsSync(projectPath)) {
          fse.outputJsonSync(projectPath, [])
        }
        const projectData = [
          ...require(projectPath),
          {
            name: this.projectName,
            createTime: new Date(),
            installCommand: setting.installCommand,
            startCommand: setting.startCommand,
            local: this.projectPath,
          },
        ]
        fse.outputFileSync(getProjectLocalPath(), JSON.stringify(projectData, null, '\t'))

        if (!this.git) {
          execSync('git', ['init'], { cwd: this.projectPath })
        }

        if (!setting.installCommand) return
        const installCommand = setting.installCommand.split(' ')
        execSync(installCommand.shift(), installCommand, { cwd: this.projectPath })

        if (!setting.startCommand) return
        const startCommand = setting.startCommand.split(' ')
        execSync(startCommand.shift(), startCommand, { cwd: this.projectPath })
      })
    })
  }
}
