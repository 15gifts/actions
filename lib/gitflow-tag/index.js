const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')

const { context } = github
const messageFlag = core.getInput('commit-message-split')
const isNegative = core.getInput('logic-gate-negative') === 'true'

try {
  const { message } = context.payload.head_commit

  const isMinor = isNegative
    ? !message.includes(messageFlag)
    : message.includes(messageFlag)

  const version = isMinor
    ? 'npm version minor'
    : 'npm version patch'

  console.log({ version })
  console.log({ message })
  console.log({ messageFlag })
  console.log({ context })

  exec.exec(version).then((data) => console.log('version update complete: ', data))
}
catch (error) {
  core.setFailed(error.message)
}
