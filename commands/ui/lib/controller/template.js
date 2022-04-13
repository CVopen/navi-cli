const fs = require('fs')

const uuid = require('uuid')

const { getPackage } = require('@navi-cli/request')

const { getLocal } = require('../utils')

const CUSTOM_FILE_NAME = 'template.json'

module.exports = { getList, addTemplate, delTemplate, updateTemplate }

const local = getLocal(CUSTOM_FILE_NAME)

function getList() {
  delete require.cache[require.resolve(local)]
  return require(local)
}

// add template
function addTemplate({ label, name, ignore = [] }) {
  const id = uuid.v4()
  return new Promise((resolve) => {
    getPackage(name)
      .then(() => {
        const templateData = require(local)
        templateData.push({ label, name, ignore, id })
        try {
          fs.writeFileSync(local, JSON.stringify(templateData, null, '\t'))
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

// del template
function delTemplate({ id }) {
  const templateData = require(local).filter((template) => template.id != id)
  try {
    fs.writeFileSync(local, JSON.stringify(templateData, null, '\t'))
    return []
  } catch (error) {
    return [null, '删除失败!']
  }
}

// update template
function updateTemplate({ label, name, ignore = [], id }) {
  const templateData = require(local)
  const index = templateData.findIndex((command) => command.id == id)
  templateData.splice(index, 1, { label, name, ignore, id })
  try {
    fs.writeFileSync(local, JSON.stringify(templateData, null, '\t'))
    return []
  } catch (error) {
    return [null, '修改失败!']
  }
}
