'use strict'

module.exports = factory

function factory(options) {
  return new Init(options)
}

class Init {
  constructor(options) {
    this.initialize(options)
  }

  initialize(options) {
    this.projectName = options.cmds[0]
    this.force = options.args.force
    console.log(this.projectName)
    console.log(this.force)
  }
}
