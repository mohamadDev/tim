#!/usr/bin/env node

// push from bundle generated by ./bundle.sh

const proc = require('child_process')
const fs = require('fs')
const build = fs.readFileSync('./iOS/Tradle/Info.plist', { encoding: 'utf8' })
const match = build.match(/CFBundleVersion<\/key>\n\s+<string>([\d\.]+)/)
const version = match && match[1].split('.').slice(0, 3).join('.')
if (!version) throw new Error('unable to parse version from Dev.plist')

const gitHash = require('./version').commit.slice(0, 6)
const releases = fs.readdirSync('./release/ios')
const releaseDir = releases.find(r => r.indexOf(gitHash) === 0)
if (!releaseDir) throw new Error('release dir not found, run bundle.sh first')

const pushLine = `code-push release tim-ios ./release/ios/${releaseDir}/ ${version} -d Staging`
console.log(`running: ${pushLine}`)

if (process.argv.indexOf('--dry-run') === -1) {
  proc.execSync(pushLine, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  })
}
