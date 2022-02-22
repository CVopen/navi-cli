'use strict'

const semver = require('semver')

function getLatestVersion(versions = [], currentVersion) {
  if (!versions.length) {
    return false
  }

  const laseVersion = versions.sort((a, b) => (semver.gt(b, a) ? 1 : -1))[0]
  if (semver.eq(laseVersion, currentVersion)) {
    return false
  }
  return laseVersion
}

function isEmptyList(target) {
  if (!Array.isArray(target)) {
    return false
  }
  if (!target[0]) {
    return false
  }
  return true
}

module.exports = {
  getLatestVersion,
  isEmptyList,
}
