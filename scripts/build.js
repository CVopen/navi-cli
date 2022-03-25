const path = require('path')
const concurrently = require('concurrently')
const log = require('npmlog')

const { result } = concurrently([
  { command: 'yarn build', cwd: path.resolve(process.cwd(), 'ui/host') },
  { command: 'yarn build', cwd: path.resolve(process.cwd(), 'ui/app-react') },
])

result.then(() => {
  log.info('success')
})
