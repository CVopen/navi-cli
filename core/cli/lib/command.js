module.exports = generateCommand

const bootstrap = require('@navi-cli/bootstrap')

function generateCommand() {
  const commandList = [
    {
      cmd: 'init [projectName]',
      description: 'generate a new project from a template',
      option: [['-f, --force', 'force initialization']],
      action: bootstrap,
    },
    {
      cmd: 'vue',
      description: 'generate a new project from a vue-cli',
      action() {
        console.log('command vue')
      },
    },
    {
      cmd: 'react',
      description: 'generate a new project from a create-react-app',
      action() {
        console.log('command react')
      },
    },
  ]

  return commandList
}
