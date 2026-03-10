const core = require('@actions/core')
const exec = require('@actions/exec')

const name = core.getInput('name')
const email = core.getInput('email')

const run = async () => {
  try {
    const setEmail = `git config --global user.email "${email}"`
    const setName = `git config --global user.name "${name}"`
    await exec.exec(setEmail)
    await exec.exec(setName)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
