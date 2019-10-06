#!/usr/bin/env node

const program = require('commander')
const execa = require('execa')
const path = require('path')
const { name } = require(path.join(process.cwd(), 'now.json'))
const { version } = require('./package.json')

process.on('unhandledRejection', (err) => console.error(err.message))

program
  .description('Alias the latest deployment to `tld`')
  .version(version)
  .arguments('<tld>')
  .option('-t, --token <token>', 'ZEIT Now token')
  .option('-b, --cleanup-before', 'remove unaliased deployments before')
  .option('-a, --cleanup-afterwards', 'remove unaliased deployments afterwards')

program.parse(process.argv)

const [ tld ] = program.args
const { cleanupBefore, cleanupAfterwards, token } = program
const tkn = token ? [`--token=${token}`] : []
const now = (...args) => execa('now', [...tkn, ...args])

const getLatestDeployment = async () => {
  const { stdout } = await now('ls', name)
  return stdout.split('\n')[1].split(' ').filter(x => x)[1]
}

const log = async (fn) => {
  const { stdout, stderr } = await fn
  return console.log(stdout || stderr)
}

;(async () => {
  if (!tld) {
    return console.error(`The argument 'tld' is required.`)
  }
  
  cleanupBefore && await log(now('rm', '--safe', '-y', name))
  const src = await getLatestDeployment()
  await log(now('alias', src, tld))
  cleanupAfterwards && await log(now('rm', '--safe', '-y', name))
})()
