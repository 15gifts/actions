const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('child_process') // Lets us run commands from inside an action

const token = core.getInput('github-token')
const name = core.getInput('name')
const email = core.getInput('email')

const octokit = new github.GitHub(token)
const context = github.context

try {
  const setEmail = `git config --global user.email "${email}"`
  const setName = `git config --global user.name "${name}"`
  exec(setEmail)
  exec(setName)

} catch (error) {
  core.setFailed(error.message);
}
