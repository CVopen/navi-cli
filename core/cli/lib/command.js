module.exports = generateCommand

const path = require('path')
const { accessSync, constants } = require('fs')

const userHome = require('user-home')

const CUSTOM_FILE_NAME = 'command.json'

function generateCommand() {
  let commandList = [
    {
      cmd: 'init <projectName>',
      description: 'generate a new project from a template',
      option: [
        ['-f, --force', 'force initialization'],
        ['-g, --git', 'initialize Git'],
      ],
      packageName: '@navi-cli/init',
    },
    {
      cmd: 'vue <vueCommand>',
      description: 'generate a new project from a vue-cli',
      packageName: '@navi-cli/vue',
    },
    {
      cmd: 'react <reactCommand>',
      description: 'generate a new project from a create-react-app',
      packageName: '@navi-cli/react',
    },
    // {
    //   cmd: 'add',
    //   description: 'add custom command',
    //   packageName: '@navi-cli/add',
    // },
    {
      cmd: 'ui',
      description: 'start and open the vue-cli ui',
      packageName: '@navi-cli/ui',
    },
  ]

  const INSIDE_CMD = commandList.map(({ cmd }) => cmd.split(' ')[0])

  const commandJSONPath = path.join(userHome, process.env.NAVI_CACHE_DIR, CUSTOM_FILE_NAME)

  try {
    accessSync(commandJSONPath, constants.F_OK)
    const customList = require(commandJSONPath).filter(({ cmd }) => !INSIDE_CMD.includes(cmd.split(' ')[0]))
    commandList = [...commandList, ...customList]
  } catch (error) {
    // error.message
  }

  return { commandList, INSIDE_CMD, commandJSONPath }
}
