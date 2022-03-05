'use strict'

module.exports = spinner

const ora = require('ora')
const dots = require('cli-spinners')

const dotsKeyList = Object.keys(dots)

function spinner({ prefixText = 'loading: ', text, index } = {}) {
  if (typeof index !== 'number') {
    index = dotsKeyList[parseInt(Math.random() * dotsKeyList.length)]
  }
  return ora({
    prefixText,
    spinner: dots[index],
  }).start(text)
}
