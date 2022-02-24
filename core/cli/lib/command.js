module.exports = generateCommand

const path = require('path')
const { accessSync, constants } = require('fs')

const userHome = require('user-home')

const CUSTOM_FILE_NAME = 'command.json'

function generateCommand() {
  let commandList = [
    {
      cmd: 'init [projectName]',
      description: 'generate a new project from a template',
      option: ['-f, --force', 'force initialization'],
    },
    {
      cmd: 'vue',
      description: 'generate a new project from a vue-cli',
    },
    {
      cmd: 'react',
      description: 'generate a new project from a create-react-app',
    },
  ]

  const commandJson = path.join(userHome, process.env.NAVI_CACHE_DIR, CUSTOM_FILE_NAME)

  try {
    accessSync(commandJson, constants.F_OK)
    const customList = require(commandJson)
    commandList = [...commandList, ...customList]
  } catch (error) {
    console.log()
  }

  return commandList
}
