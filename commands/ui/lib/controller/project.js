const open = require('@navi-cli/open')
const { print } = require('@navi-cli/log')

const { resolve } = require('path')
const fs = require('fs')
const child = require('child_process')

const pathExists = require('path-exists').sync
const fse = require('fs-extra')

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'project.json'

module.exports = { getList, openFold, getPath, getDisc }

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

function getPath({ path = process.cwd(), status = false }) {
  if (status) {
    fse.ensureDirSync(path)
  }
  const PACKAGE = 'package.json'
  const DEPENDENCIES = 'dependencies'
  const isWin = process.platform === 'win32'
  if (isWin && path.length === 2) {
    path += '/'
  }
  const folderList = fs
    .readdirSync(path)
    .filter((name) => {
      let stat
      try {
        stat = fs.lstatSync(resolve(path, name))
      } catch (error) {
        return false
      }
      return stat.isDirectory()
    })
    .map((folderName) => {
      const local = resolve(path, folderName, PACKAGE)
      let frame = ''
      if (pathExists(local)) {
        const pkg = require(local)
        pkg[DEPENDENCIES]?.vue && (frame = 'vue')
        pkg[DEPENDENCIES]?.react && (frame = 'react')
      }
      return { folderName, frame }
    })
  if (isWin && path.length === 3) {
    path = path.slice(0, 2)
  }
  const paths = path.split(isWin ? '\\' : '/')

  return {
    folderList,
    path: isWin ? ['~', ...paths] : paths,
  }
}

function getDisc() {
  return new Promise((resolve, reject) => {
    child.exec('wmic logicaldisk get caption', (error, stdout) => {
      if (error !== null) {
        console.error(error)
        reject()
        return
      }
      const strList = [...stdout]
      const list = strList.reduce((target, str, index, arr) => {
        if (str === ':') {
          target.push(arr[index - 1] + str)
        }
        return target
      }, [])
      resolve(list)
    })
  })
}
