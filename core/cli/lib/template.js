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
    label: 'vue3 项目基础模板',
    name: 'open-cli-template-vue',
    ignore: ['**/public/**', '**.png'],
  },
]

function generateTemplate() {
  const local = getTemplateLocalPath()
  let localData = require(local).filter(({ name }) => !NAVI_TEMPLATE.find((item) => item.name === name))
  fs.writeFileSync(local, JSON.stringify([...NAVI_TEMPLATE, ...localData], null, '\t'))
}
