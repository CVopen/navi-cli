const path = require('path')
const concurrently = require('concurrently')
const log = require('npmlog')
const fs = require('fs-extra')

const { result } = concurrently([
  { command: 'yarn build', cwd: path.resolve(process.cwd(), 'ui/main') },
  { command: 'yarn build', cwd: path.resolve(process.cwd(), 'ui/sub-react') },
])

result.then(() => {
  log.info('Success')
  moveAssets()
  log.info('Move resource succeeded')
})

const subAsset = ['sub-react']

function moveAssets() {
  const mainStaticPath = path.resolve(process.cwd(), 'ui/main/dist')
  const uiStaticPath = path.resolve(process.cwd(), 'commands/ui/lib/static')
  fs.emptyDirSync(uiStaticPath)
  fs.copySync(mainStaticPath, uiStaticPath)

  subAsset.forEach((item) => {
    const subStaticPath = path.resolve(process.cwd(), `ui/${item}/dist`)
    fs.copySync(subStaticPath, path.resolve(uiStaticPath, item))
  })
}
