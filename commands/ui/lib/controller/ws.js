const path = require('path')
const fs = require('fs')

const pathExists = require('path-exists').sync
const notifier = require('node-notifier')

const { exec } = require('@navi-cli/child-process')

const { handleGetList } = require('./project')
const { sendWsString } = require('../utils')

const { getLocal } = require('../utils')

const DEPENDENCIES = 'node_modules'
const type = {
  DATA: 'data',
  ERROR: 'error',
  START: 'start',
  END: 'end',
}

const option = notifier.WindowsToaster === notifier.Notification && { appID: 'Navi-cli' }

function execCommand(project, ws) {
  return new Promise((resolve, reject) => {
    const cmdList = project.command.split(' ')
    const cmd = cmdList.shift()
    try {
      const cp = exec(cmd, cmdList, { stdio: 'pipe', cwd: project.local })
      const startTime = new Date().getTime()
      ws.send(sendWsString({ type: type.DATA, data: `$ ${project.command}` }))

      let stdoutList
      cp.stdout.on('data', (data) => {
        stdoutList = Buffer.concat([stdoutList || Buffer.alloc(0), data])
      })
      cp.stdout.on('end', () => {
        ws.send(sendWsString({ type: type.DATA, data: stdoutList.toString() }))
      })

      cp.on('exit', (code) => {
        const endTime = new Date().getTime()
        notifier.notify({
          ...option,
          title: `Task ${code ? 'failed' : 'completed'}`,
          message: `Task ${project.local}:${cmd} ${code ? 'failed' : 'completed'} in ${(
            (endTime - startTime) /
            1000
          ).toFixed(2)}s.`,
          icon: path.join(__dirname, `../assets/${code ? 'close' : 'ok'}.svg`),
        })
        !code ? resolve() : reject()
      })
    } catch (error) {
      ws.send(sendWsString({ type: type.ERROR, data: '执行操作失败!' }))
    }
  })
}

function run(project, ws) {
  ws.send(sendWsString({ type: type.END, data: new Date().toString() }))
  const cmdList = project.startCommand.split(' ')
  ws.send(sendWsString({ type: type.DATA, data: `$ ${project.startCommand}\n\n🌠  New terminal is opened` }))
  try {
    exec(cmdList.shift(), cmdList, { stdio: 'ignore', cwd: project.local, detached: true }).unref()
  } catch (error) {
    ws.send(sendWsString({ type: type.ERROR, data: '执行操作失败!' }))
  }
}

module.exports = {
  start(local, ws) {
    let projectList = handleGetList()
    const project = projectList.find((item) => item.local === local)
    if (!project) return ws.send(sendWsString({ type: type.ERROR, data: '项目不存在' }))
    if (!pathExists(local)) {
      projectList = projectList.filter((item) => item.local !== local)
      fs.writeFileSync(getLocal('project.json'), JSON.stringify(projectList, null, '\t'))
      return ws.send(sendWsString({ type: type.ERROR, data: '项目不存在' }))
    }
    ws.send(sendWsString({ type: type.START }))
    if (!pathExists(path.resolve(local, DEPENDENCIES))) {
      execCommand({ command: project.installCommand || 'npm install', local }, ws).then(() => {
        ws.send(sendWsString({ type: type.END }))
        run(project, ws)
      })
    } else {
      run(project, ws)
    }
  },
  build(local, ws) {
    let projectList = handleGetList()
    const project = projectList.find((item) => item.local === local)
    if (!project) return ws.send(sendWsString({ type: type.ERROR, data: '项目不存在' }))
    if (!pathExists(local)) {
      projectList = projectList.filter((item) => item.local !== local)
      fs.writeFileSync(getLocal('project.json'), JSON.stringify(projectList, null, '\t'))
      return ws.send(sendWsString({ type: type.ERROR, data: '项目不存在' }))
    }
    if (!project.buildCommand) return ws.send(sendWsString({ type: type.ERROR, data: '未添加build命令' }))
    ws.send(sendWsString({ type: type.START }))
    if (!pathExists(path.resolve(local, DEPENDENCIES))) {
      execCommand({ command: project.installCommand || 'npm install', local }).then(() =>
        execCommand({ command: project.buildCommand, local }, ws).then(() => {
          ws.send(sendWsString({ type: type.END }))
        })
      )
    } else {
      execCommand({ command: project.buildCommand, local }, ws).then(() => {
        ws.send(sendWsString({ type: type.END }))
      })
    }
  },
}
