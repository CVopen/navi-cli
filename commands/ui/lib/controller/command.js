const path = require('path')
const fs = require('fs')

const userHome = require('user-home')
const pathExists = require('path-exists').sync

const { getPackage } = require('@navi-cli/request')

const { getCacheDir } = require('../utils')

const CUSTOM_FILE_NAME = 'command.json'

module.exports = { getList, addCommand }

function _getLocal() {
  return path.join(userHome, getCacheDir(), CUSTOM_FILE_NAME)
}

function getList() {
  return require(_getLocal())
}

// add command
async function addCommand({ cmd, description, packageName, targetPath, option = [] }) {
  return new Promise((resolve) => {
    if (targetPath && !pathExists(targetPath)) {
      resolve([null, '调试路径不存在!'])
    }
    if (packageName) {
      getPackage(packageName)
        .then(() => {
          const commandData = require(_getLocal())
          commandData.push({ cmd, description, packageName, targetPath, option })
          try {
            fs.writeFileSync(_getLocal(), JSON.stringify(commandData, null, '\t'))
            resolve([])
          } catch (error) {
            resolve([null, '写入失败!'])
          }
        })
        .catch(() => {
          resolve([null, '对应包不存在!'])
        })
    } else {
      resolve([null, 'error'])
    }
  })
}
