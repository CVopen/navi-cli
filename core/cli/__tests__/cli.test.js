'use strict';

const cli = require('..')

describe('@open-cli/cli', () => {
  it('@open-cli/cli tests', () => {
    expect(cli()).toBe('cli')
  })
})

describe('@open-cli/cli2', () => {
  it('@open-cli/cli tests', () => {
    expect(cli()).toBe('cli')
  })
})