const open = require('@navi-cli/open')
const { print } = require('@navi-cli/log')
const Package = require('@navi-cli/package')

const path = require('path')
const { resolve } = path
const fs = require('fs')
const child = require('child_process')

const pathExists = require('path-exists').sync
const fse = require('fs-extra')
const ejs = require('ejs')

const { getLocal, getCacheTemplateDir } = require('../utils')

const CUSTOM_FILE_NAME = 'project.json'

module.exports = {
  handleGetList,
  handleOpenFold,
  handleGetPath,
  handleGetDisc,
  handleGetTemplateInfo,
  handleCreateProject,
}

const local = getLocal(CUSTOM_FILE_NAME)

function handleGetList() {
  try {
    fs.accessSync(local, fs.constants.F_OK)
  } catch (error) {
    fs.writeFileSync(local, '[]')
  }
  delete require.cache[require.resolve(local)]
  return require(local)
}

function handleOpenFold({ local }) {
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

function handleGetPath({ path = process.cwd(), status = false }) {
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

function handleGetDisc() {
  return new Promise((resolve, reject) => {
    child.exec('wmic logicaldisk get caption', (error, stdout) => {
      if (error !== null) {
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

async function handleGetTemplateInfo({ name }) {
  const pkg = await createPkg(name)
  return require(path.join(pkg.getPkgLocal(), 'setting.json')).template
}

async function handleCreateProject({ name, packageName, projectInfo, targetPath }) {
  const pkg = await createPkg(packageName),
    templatePath = path.resolve(pkg.getPkgLocal(), 'template'),
    settingPath = path.resolve(pkg.getPkgLocal(), 'setting.json'),
    LRU = require('lru-cache'),
    glob = require('glob'),
    options = {
      cwd: templatePath,
      nodir: true,
    },
    settingJson = require(settingPath)

  projectInfo.ignore = settingJson.ignore || []

  return new Promise((resolve, reject) => {
    glob('**', { ...options, ignore: [...projectInfo.ignore, '**/*.html'] }, (err, files) => {
      if (err) {
        reject('解析模板失败!')
      } else {
        ejs.cache = new LRU(files.length)
        const target = Object.create(null)
        files.forEach((file) => {
          const filePath = path.join(templatePath, file)
          target[filePath] = file
          ejs.renderFile(filePath, projectInfo, { cache: true, async: true }, (err) => {
            if (err) reject('解析模板失败!')
          })
        })
        glob('**', options, (error, fileAll) => {
          if (error) reject('解析模板失败!')
          fileAll
            .filter((i) => !files.includes(i))
            .forEach((file) => {
              const target = path.join(targetPath, name, file)
              const current = path.join(path.resolve(pkg.getPkgLocal(), 'template'), file)
              fse.copySync(current, target)
            })

          const cacheSize = ejs.cache.max
          let count = 0

          ejs.cache.forEach((value, key) => {
            const targetProjectPath = path.join(targetPath, name, target[key])
            value(projectInfo).then((res) => {
              fse.ensureFileSync(targetProjectPath)
              fse.writeFileSync(targetProjectPath, res)
              count++
              if (count !== cacheSize) return
              ejs.clearCache()

              saveProject(name, settingJson, targetPath)
              resolve(new Date())
            })
          })
        })
      }
    })
  })
}

async function createPkg(packageName) {
  const pkg = new Package({
    packageName,
    targetPath: getCacheTemplateDir(),
    chaheLocal: getCacheTemplateDir(),
  })
  if (!(await pkg.exists())) {
    await pkg.install()
    print('info', 'install package success')
  }
  return pkg
}

function saveProject(name, settingJson, targetPath) {
  let projectList = handleGetList()
  const projectData = [
    ...projectList,
    {
      name,
      createTime: new Date(),
      installCommand: settingJson.installCommand,
      startCommand: settingJson.startCommand,
      local: path.join(targetPath, name),
    },
  ]
  fse.outputFileSync(local, JSON.stringify(projectData, null, '\t'))
}
