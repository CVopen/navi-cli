const TEMPLATE_JSON = 'template.json'
const COMMAND_JSON = 'command.json'

const COMMAND = 'addCommand'
const TEMPLATE = 'addTemplate'

const optionsPromptList = [
  {
    name: 'args',
    message: '命令行参数:',
    tip: '请输入命令行参数',
  },
  {
    type: 'list',
    message: '选择默认值:',
    name: 'defaults',
    choices: ['无', 'true', 'false'],
  },
  {
    name: 'description',
    message: '参数描述:',
    tip: '请输入参数描述',
  },
]

const commandPromptList = [
  {
    name: 'name',
    message: '命令名称:',
    tip: '请输入命令名称',
  },
  {
    name: 'description',
    message: '命令描述:',
    tip: '请输入命令描述',
  },
  {
    name: 'requiredParam',
    message: '必选参数名:',
  },
  {
    name: 'optionalParam',
    message: '可选参数名:',
  },
]

module.exports = {
  TEMPLATE_JSON,
  COMMAND_JSON,
  COMMAND,
  TEMPLATE,
  optionsPromptList,
  commandPromptList,
}
