const path = require('path')
const concurrently = require('concurrently')
const log = require('npmlog')

const { result } = concurrently([
  { command: 'yarn', cwd: path.resolve(process.cwd(), 'ui/main') },
  { command: 'yarn', cwd: path.resolve(process.cwd(), 'ui/sub-react') },
])

result.then(() => {
  log.info('success')
})
