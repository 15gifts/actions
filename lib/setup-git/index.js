const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('child_process') // Lets us run commands from inside an action

const context = github.context
const name = core.getInput('name')
const email = core.getInput('email')
const octokit = new github.GitHub(token)

try {
  const setEmail = `git config user.email "${email}"`
  const setName = `git config user.name "${name}"`
  exec(setEmail)
  exec(setName)

} catch (error) {
  core.setFailed(error.message);
}
