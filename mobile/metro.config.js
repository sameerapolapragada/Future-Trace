const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

// When mobile/ lives inside the Next.js repo, block the web app's node_modules.
config.watchFolders = [projectRoot]
config.resolver.blockList = [
  new RegExp(`${escapeRegExp(path.join(workspaceRoot, 'node_modules'))}.*`),
]

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = config
