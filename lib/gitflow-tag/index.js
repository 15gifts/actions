const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('child_process') // Lets us run commands from inside an action

const { context } = github
const messageFlag = core.getInput('commit-message-split')
const isNegative = core.getInput('logic-gate-negative') === 'true'

const isMinor = isNegative
  ? !message.includes(messageFlag)
  : message.includes(messageFlag)

try {
  const { message } = context.payload.head_commit

  const version = isMinor
    ? 'npm version minor'
    : 'npm version patch'

  console.log({ version })
  console.log({ message })
  console.log({ messageFlag })
  console.log({ context })

  exec(version)
}
catch (error) {
  core.setFailed(error.message)
}
