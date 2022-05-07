'use strict'

module.exports = index

const fs = require('fs')

const { ValidationError } = require('@navi-cli/log')
const { getPackage } = require('@navi-cli/request')

const inquirer = require('inquirer')
const uuid = require('uuid')
const pkgDir = require('pkg-dir').sync

const { TEMPLATE, COMMAND, optionsPromptList, commandPromptList } = require('./const')
const { getList, getTemplateLocalPath, getCommandLocalPath, createPromptList } = require('./utils')

function index(options) {
  return new Add(options)
}

class Add {
  constructor(options) {
    let chain = Promise.resolve()
    chain = chain.then(this.initialize.bind(this, options))
    chain = chain.then(this.isCommandOrTemplate.bind(this))
    chain = chain.then(this.validateRepeat.bind(this))
    chain = chain.then(this.validatePkgExist.bind(this))
    chain = chain.then(this.execute.bind(this))
    chain.catch((err) => {
      throw new ValidationError('red', err.message)
    })
  }

  initialize(options) {
    this.command = options.args.command
    this.commandLocal = options.args.commandLocal
    this.template = options.args.template
    this.method = COMMAND
  }

  isCommandOrTemplate() {
    if (this.template) this.method = TEMPLATE
    return this[this.method]()
  }

  async addCommand() {
    if (this.commandLocal) {
      commandPromptList.push({
        name: 'targetPath',
        message: '本地调试路径:',
        tip: '请输入本地调试路径',
      })
    } else {
      commandPromptList.push({
        name: 'packageName',
        message: 'npm包名称:',
        tip: '请输入npm包名称',
      })
    }

    const templateInfo = await inquirer.prompt(createPromptList(commandPromptList))

    const createOption = async () => {
      const { conut } = await inquirer.prompt([
        {
          type: 'input',
          message: '添加参数数量:',
          name: 'conut',
          validate(v) {
            const done = this.async()
            const _validate = () => {
              if (isNaN(Number(v))) return done('请输入数字')
              done(null, true)
            }
            setTimeout(_validate)
          },
        },
      ])
      if (!Number(conut)) return []
      return Promise.all(
        Array(conut)
          .fill(0)
          .map(async () => await inquirer.prompt(createPromptList(optionsPromptList)))
      )
    }
    const option = (await createOption()).map(({ args, defaults, description }) => [
      `-${args[0].toUpperCase()}, --${args}`,
      description,
      defaults,
    ])
    let cmd = templateInfo.name
    if (templateInfo.requiredParam) {
      cmd += ` <${templateInfo.requiredParam}>`
    }
    if (templateInfo.optionalParam) {
      cmd += ` [${templateInfo.optionalParam}]`
    }
    return {
      cmd,
      description: templateInfo.description,
      packageName: templateInfo.packageName,
      targetPath: templateInfo.targetPath,
      option,
    }
  }

  async addTemplate() {
    const paramsList = [
      {
        name: 'label',
        message: '模板描述:',
        tip: '请输入模板描述',
      },
      {
        name: 'name',
        message: 'npm包名称:',
        tip: '请输入npm包名称',
      },
    ]
    const templateInfo = await inquirer.prompt(createPromptList(paramsList))
    templateInfo.id = uuid.v4()
    templateInfo.date = new Date()
    return templateInfo
  }

  validateRepeat(info) {
    const list = getList(this.method)
    if (this.commandLocal && !pkgDir(info.targetPath)) {
      throw new Error(`目标目录: '${info.targetPath}' 不存在.`)
    } else {
      const packageName = (this.template ? info.name : info.packageName).trim()
      const flag = list.find((item) => (this.template ? item.name : item.packageName) === packageName)
      if (flag) {
        if (this.template) throw new Error(`package: '${packageName}' 已经添加过模板, 模板描述: '${flag.label}'.`)
        throw new Error(`package: '${packageName}' 已经添加过'${flag.cmd.split(' ').shift()}'命令.`)
      }
    }

    if (!this.template && list.find((item) => item.cmd.split(' ').shift() === info.cmd.split(' ').shift())) {
      throw new Error(`已经添加过'${info.cmd.split(' ').shift()}'命令.`)
    }
    return info
  }

  async validatePkgExist(info) {
    if (!this.commandLocal) {
      const packageName = (this.template ? info.name : info.packageName).trim()
      try {
        await getPackage(packageName)
      } catch (error) {
        throw new Error('对应包不存在!')
      }
    }
    return info
  }

  execute(info) {
    const data = [...getList(this.method), info]
    const local = this.template ? getTemplateLocalPath() : getCommandLocalPath()
    fs.writeFileSync(local, JSON.stringify(data, null, '\t'))
  }
}
