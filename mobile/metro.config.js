const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const projectRoot = __dirname
const repoRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

const repoData = path.resolve(repoRoot, 'data')

config.watchFolders = [projectRoot, repoData]
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]

// Next.js at repo root installs React 18 — never bundle it into the Expo app.
const repoNodeModules = path.resolve(repoRoot, 'node_modules').replace(/[/\\]/g, '[/\\\\]')
config.resolver.blockList = [new RegExp(`${repoNodeModules}/.*`)]

module.exports = withNativeWind(config, { input: './global.css' })
