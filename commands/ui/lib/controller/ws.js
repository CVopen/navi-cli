const pathExists = require('path-exists').sync

const path = require('path')

const { exec } = require('@navi-cli/child-process')
const { getList } = require('./project')
const { sendWsString } = require('../utils')

const DEPENDENCIES = 'node_modules'
const type = {
  START: 'startTime',
  END: 'endTime',
  DATA: 'data',
  ERROR: 'error',
}

function execCommand(project, ws) {
  return new Promise((resolve) => {
    const cmdList = project.command.split(' ')
    const cp = exec(cmdList.shift(), cmdList, { stdio: 'pipe', cwd: project.local })
    ws.send(sendWsString({ type: type.START, data: new Date().toString() }))
    ws.send(sendWsString({ type: type.DATA, data: `$ ${project.command}` }))

    let stdoutList
    cp.stdout.on('data', (data) => {
      stdoutList = Buffer.concat([stdoutList || Buffer.alloc(0), data])
    })
    cp.stdout.on('end', () => {
      ws.send(sendWsString({ type: type.DATA, data: stdoutList.toString() }))
    })

    cp.on('exit', () => {
      ws.send(sendWsString({ type: type.END, data: new Date().toString() }))
      resolve()
    })
  })
}

function run(project, ws) {
  return () => {
    ws.send(sendWsString({ type: type.END, data: new Date().toString() }))
    const cmdList = project.startCommand.split(' ')
    exec(cmdList.shift(), cmdList, { stdio: 'ignore', cwd: project.local, detached: true }).unref()
    ws.send(sendWsString({ type: type.DATA, data: `$ ${project.startCommand}\n\n🌠  New terminal is opened` }))
  }
}

module.exports = {
  start(local, ws) {
    const project = getList().find((item) => item.local === local)
    if (!project) return ws.send({ type: type.ERROR, data: '项目不存在' })

    if (!pathExists(path.resolve(local, DEPENDENCIES))) {
      execCommand({ command: project.installCommand || 'npm install', local }, ws).then(() => {
        run(project, ws)
      })
    } else {
      run(project, ws)()
    }
  },
  build(local, ws) {
    const project = getList().find((item) => item.local === local)
    if (!project) return ws.send({ type: type.ERROR, data: '项目不存在' })

    if (!project.buildCommand) ws.send({ type: type.ERROR, data: '未添加build命令' })

    if (!pathExists(path.resolve(local, DEPENDENCIES))) {
      execCommand({ command: project.installCommand || 'npm install', local }).then(() =>
        execCommand({ command: project.buildCommand, local }, ws)
      )
    } else {
      execCommand({ command: project.buildCommand, local }, ws)
    }
  },
}
