const core = require('@actions/core')
const { exec } = require('child_process') // Lets us run commands from inside an action

const name = core.getInput('name')
const email = core.getInput('email')
const token = core.getInput('github-token')

try {
  const setEmail = `git config --global user.email "${email}"`
  const setName = `git config --global user.name "${name}"`
  exec(setEmail)
  exec(setName)
  core.setOutput('token', token)
}
catch (error) {
  core.setFailed(error.message)
}
