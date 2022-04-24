const open = require('@navi-cli/open')
const { print } = require('@navi-cli/log')

const { resolve } = require('path')
const fs = require('fs')

const pathExists = require('path-exists').sync

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'project.json'

module.exports = { getList, openFold, getPath }

const local = getLocal(CUSTOM_FILE_NAME)

function getList() {
  try {
    fs.accessSync(local, fs.constants.F_OK)
  } catch (error) {
    fs.writeFileSync(local, '[]')
  }
  delete require.cache[require.resolve(local)]
  return require(local)
}

function openFold({ local }) {
  return new Promise((resolve) => {
    const exec = open(local)
    exec.on('exit', (code) => {
      if (code != 0) {
        print('error', `Open folder '${local}' fail, exit code '${code}'`)
      }
      resolve(code)
    })
  })
}

function getPath({ path = process.cwd() }) {
  const PACKAGE = 'package.json'
  const DEPENDENCIES = 'dependencies'
  const folderList = fs
    .readdirSync(path)
    .filter((name) => {
      let stat = fs.lstatSync(resolve(path, name))
      return stat.isDirectory()
    })
    .map((folderName) => {
      const local = resolve(path, folderName, PACKAGE)
      let frame = ''
      if (pathExists(local)) {
        const pkg = require(local)
        pkg[DEPENDENCIES].vue && (frame = 'vue')
        pkg[DEPENDENCIES].react && (frame = 'react')
      }
      return { folderName, frame }
    })

  const isWin = process.platform === 'win32'
  const paths = process.cwd().split(isWin ? '\\' : '/')

  return {
    folderList,
    path: isWin ? ['~', ...paths] : paths,
  }
}
