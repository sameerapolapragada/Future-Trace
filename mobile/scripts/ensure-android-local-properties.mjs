#!/usr/bin/env node
/**
 * Writes android/local.properties with sdk.dir when missing.
 * Gradle requires this (or ANDROID_HOME) to locate the Android SDK.
 */
import { existsSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localPropertiesPath = join(root, 'android', 'local.properties')

if (existsSync(localPropertiesPath)) {
  process.exit(0)
}

const sdkCandidates = [
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  join(homedir(), 'Library', 'Android', 'sdk'),
  join(homedir(), 'Android', 'Sdk'),
].filter(Boolean)

const sdkDir = sdkCandidates.find((dir) => existsSync(join(dir, 'platform-tools', 'adb')))

if (!sdkDir) {
  console.error(`
Could not find the Android SDK. Install Android Studio, then either:

  1. Set ANDROID_HOME to your SDK path, e.g.:
     export ANDROID_HOME=$HOME/Library/Android/sdk

  2. Or create mobile/android/local.properties manually:
     sdk.dir=/Users/YOU/Library/Android/sdk
`)
  process.exit(1)
}

writeFileSync(localPropertiesPath, `sdk.dir=${sdkDir}\n`, 'utf8')
console.log(`Created android/local.properties → ${sdkDir}`)
