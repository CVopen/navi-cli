'use strict'

module.exports = exec

const { print } = require('@navi-cli/log')

// const execa = require('execa')

function exec(execPkgPath, options) {
  options = init(options)

  print('verbose', 'options', options)
  // 执行
  print('verbose', 'execPkgPath', execPkgPath, 'cyan')

  const Command = require(execPkgPath)
  if (!Command.prototype.exec) {
    throw new Error('the exec method must be implemented')
  }

  new Command(options).exec()

  // const code = `new Command(${JSON.stringify(options)})`
  // const child = execa('node', ['-e', code], {
  //   cwd: process.cwd(),
  //   stdio: 'inherit',
  // })
  // child.on('error', (err) => {
  //   console.log('child.error', err.message)
  //   process.exit(1)
  // })
  // child.on('exit', function () {
  //   console.log(arguments)
  // })
  // child.on('exit', (e) => {
  //   console.log('child.exit', e)
  //   process.exit(e)
  // })
}

function init(options) {
  const command = Object.create(null)
  Object.keys(options.command).forEach((key) => {
    if (key.startsWith('_') || key === 'parent') return
    command[key] = options.command[key]
  })
  options.command = command
  delete options.execPkgName
  return options
}
