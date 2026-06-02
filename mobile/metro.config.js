const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname

const config = getDefaultConfig(projectRoot)

// Monorepo: mobile/ inside Next.js repo — resolve deps only from mobile/node_modules
config.watchFolders = [projectRoot]
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]
config.resolver.disableHierarchicalLookup = true

module.exports = config
