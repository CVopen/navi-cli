'use strict'

module.exports = bootstrap

function bootstrap() {
  console.log(arguments[arguments.length - 1].name())
}
