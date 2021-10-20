const core = require('@actions/core')
const { exec } = require('child_process') // Lets us run commands from inside an action

const name = core.getInput('name')
const email = core.getInput('email')

try {
  const setEmail = `git config --global user.email "${email}"`
  const setName = `git config --global user.name "${name}"`
  exec(setEmail)
  exec(setName)
  const {execSync} = require('child_process');
  let current_branch = execSync('git branch --show-current');
  current_branch = current_branch.trim();
  console.log('Current branch: ' + current_branch);
  core.setOutput('current_branch', current_branch)  
}
catch (error) {
  core.setFailed(error.message)
}
