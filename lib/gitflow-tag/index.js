const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('child_process') // Lets us run commands from inside an action

const context = github.context
const messageFlag = core.getInput('commit-message-split')

try {
  const [ lastCommit ] = context.payload.commits

  const version = lastCommit.message.includes(messageFlag)
    ? 'npm version minor'
    : 'npm version patch'

  exec(version)
}
catch (error) {
  core.setFailed(error.message)
}
