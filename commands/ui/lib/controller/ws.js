const path = require('path')

const pathExists = require('path-exists').sync
const notifier = require('node-notifier')

const { exec } = require('@navi-cli/child-process')

const { getList } = require('./project')
const { sendWsString } = require('../utils')

const DEPENDENCIES = 'node_modules'
const type = {
  DATA: 'data',
  ERROR: 'error',
}

const option = notifier.WindowsToaster === notifier.Notification && { appID: 'Navi-cli' }

function execCommand(project, ws) {
  return new Promise((resolve, reject) => {
    const cmdList = project.command.split(' ')
    const cmd = cmdList.shift()
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
