module.exports = generateTemplate

const path = require('path')
const fs = require('fs')

const userHome = require('user-home')

const CUSTOM_FILE_NAME = 'template.json'

function getTemplateLocalPath() {
  return path.resolve(userHome, process.env.NAVI_CACHE_DIR, CUSTOM_FILE_NAME)
}

const NAVI_TEMPLATE = [
  {
    label: 'react+ts+rtk webpack5项目基础模板',
    name: 'navi-cli-template-react-ts-rtk',
    ignore: ['**/public/**', '**.svg'],
  },
  {
    label: 'react+rtk webpack5项目基础模板',
    name: 'navi-cli-template-react-rtk',
    ignore: ['**/public/**', '**.svg'],
  },
]

function generateTemplate() {
  const local = getTemplateLocalPath()
  let localTemplate = []
  try {
    localTemplate = require(local)
  } catch (error) {
    fs.mkdirSync(path.resolve(local, '../'))
  }
  let localData = localTemplate.filter(({ name }) => !NAVI_TEMPLATE.find((item) => item.name === name))
  fs.writeFileSync(local, JSON.stringify([...NAVI_TEMPLATE, ...localData], null, '\t'))
}
