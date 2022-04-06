const path = require('path')
const fs = require('fs')

const userHome = require('user-home')
const pathExists = require('path-exists').sync
const uuid = require('uuid')

const { getPackage } = require('@navi-cli/request')

const { getCacheDir } = require('../utils')

const CUSTOM_FILE_NAME = 'command.json'

module.exports = { getList, addCommand, delCommand, updateCommand }

function _getLocal() {
  return path.join(userHome, getCacheDir(), CUSTOM_FILE_NAME)
}

function getList() {
  delete require.cache[require.resolve(_getLocal())]
  return require(_getLocal())
}

// add command
function addCommand({ cmd, description, packageName, targetPath, option = [] }) {
  const id = uuid.v4()
  return new Promise((resolve) => {
    if (targetPath && !pathExists(targetPath)) resolve([null, '调试路径不存在!'])
    if (!packageName) resolve([null, 'error'])
    getPackage(packageName)
      .then(() => {
        const commandData = require(_getLocal())
        commandData.push({ cmd, description, packageName, targetPath, option, id })
        try {
          fs.writeFileSync(_getLocal(), JSON.stringify(commandData, null, '\t'))
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
  const commandData = require(_getLocal()).filter((command) => command.id != id)
  try {
    fs.writeFileSync(_getLocal(), JSON.stringify(commandData, null, '\t'))
    return []
  } catch (error) {
    return [null, '删除失败!']
  }
}

// update command
function updateCommand({ cmd, description, packageName, targetPath, option = [], id }) {
  const commandData = require(_getLocal())
  const index = commandData.findIndex((command) => command.id == id)
  commandData.splice(index, 1, { cmd, description, packageName, targetPath, option, id })
  try {
    fs.writeFileSync(_getLocal(), JSON.stringify(commandData, null, '\t'))
    return []
  } catch (error) {
    return [null, '修改失败!']
  }
}
