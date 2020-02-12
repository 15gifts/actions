const core = require('@actions/core')
const github = require('@actions/github')
const { exec } = require('child_process') // Lets us run commands from inside an action

const context = github.context

try {
  const pkg = core.getInput('package')
  const masterTag = core.getInput('master-tag')
  const releaseTag = core.getInput('release-tag')
  const developTag = core.getInput('develop-tag')

  const { payload: { ref } } = context
  const branch = ref.replace('refs/heads/', '')

  const version = (() => {
    if (branch.includes('master')) return `${pkg}${masterTag}`
    if (branch.includes('release/')) return `${pkg}${releaseTag}`
    if (branch.includes('develop')) return `${pkg}${developTag}`
  })()

  console.log({ version })
  exec(`npm i ${version}`)
}
catch (error) {
  core.setFailed(error.message)
}
