'use strict'

const path = require('path')

const semver = require('semver')

function getSortVersion(versions) {
  return versions.sort((a, b) => (semver.gt(b, a) ? 1 : -1))
}

function getIsLatestVersion(versions = [], currentVersion) {
  if (!versions.length) {
    return false
  }

  const laseVersion = getSortVersion(versions)[0]
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

function formatPath(p) {
  if (p && typeof p === 'string') {
    const sep = path.sep
    if (sep === '/') {
      return p
    } else {
      return p.replace(/\\/g, '/')
    }
  }
  return p
}

module.exports = {
  getIsLatestVersion,
  isEmptyList,
  formatPath,
  getSortVersion,
}
