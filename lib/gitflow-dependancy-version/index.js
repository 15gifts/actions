const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

try {
  const package = core.getInput('package')
  const masterTag = core.getInput('master-tag')
  const releaseTag = core.getInput('release-tag')
  const developTag = core.getInput('develop-tag')

  const { payload: { ref } } = context
  const branch = ref.replace('refs/heads/', '')

  const version = (() => {
    if (branch.includes('master')) return `${package}${masterTag}`
    if (branch.includes('release/')) return `${package}${releaseTag}`
    if (branch.includes('develop')) return `${package}${developTag}`
  })()

  console.log({ version })

  core.setOutput('version', version)

} catch (error) {
  core.setFailed(error.message);
}
