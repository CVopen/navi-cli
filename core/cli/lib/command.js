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
      packageName: '@navi-cli/init',
    },
    {
      cmd: 'vue',
      description: 'generate a new project from a vue-cli',
      packageName: '@navi-cli/vue',
    },
    {
      cmd: 'react',
      description: 'generate a new project from a create-react-app',
      packageName: '@navi-cli/react',
    },
    {
      cmd: 'add',
      description: 'add custom command',
      packageName: '@navi-cli/add',
    },
  ]

  const INSIDE_CMD = commandList.map(({ cmd }) => cmd.split(' ')[0])

  const commandJson = path.join(userHome, process.env.NAVI_CACHE_DIR, CUSTOM_FILE_NAME)

  try {
    accessSync(commandJson, constants.F_OK)
    const customList = require(commandJson)
    commandList = [...commandList, ...customList]
    console.log(35)
  } catch (error) {
    // error.message
  }

  return { commandList, INSIDE_CMD }
}
