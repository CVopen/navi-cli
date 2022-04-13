const fs = require('fs')

const pathExists = require('path-exists').sync
const uuid = require('uuid')

const { getPackage } = require('@navi-cli/request')

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'command.json'

module.exports = { getList, addCommand, delCommand, updateCommand }

const local = getLocal(CUSTOM_FILE_NAME)

function getList() {
  delete require.cache[require.resolve(local)]
  return require(local)
}

// add command
function addCommand({ cmd, description, packageName, targetPath, option = [] }) {
  const id = uuid.v4()
  return new Promise((resolve) => {
    if (targetPath && !pathExists(targetPath)) resolve([null, '调试路径不存在!'])
    if (!packageName) resolve([null, 'error'])
    getPackage(packageName)
      .then(() => {
        const commandData = require(local)
        commandData.push({ cmd, description, packageName, targetPath, option, id })
        try {
          fs.writeFileSync(local, JSON.stringify(commandData, null, '\t'))
          resolve([{ id }])
        } catch (error) {
          resolve([null, '写入失败!'])
        }
      })
      .catch(() => {
        resolve([null, '对应包不存在!'])
      })
  })
}

// del command
function delCommand({ id }) {
  const commandData = require(local).filter((command) => command.id != id)
  try {
    fs.writeFileSync(local, JSON.stringify(commandData, null, '\t'))
    return []
  } catch (error) {
    return [null, '删除失败!']
  }
}

// update command
function updateCommand({ cmd, description, packageName, targetPath, option = [], id }) {
  const commandData = require(local)
  const index = commandData.findIndex((command) => command.id == id)
  commandData.splice(index, 1, { cmd, description, packageName, targetPath, option, id })
  try {
    fs.writeFileSync(local, JSON.stringify(commandData, null, '\t'))
    return []
  } catch (error) {
    return [null, '修改失败!']
  }
}
