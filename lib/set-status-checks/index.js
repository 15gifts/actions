const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const setStatusChecks = async () => {
  const contexts = core.getInput('checks')

  const { payload: { ref } } = context
  const branch = ref.replace('refs/heads/', '')

  const [owner, repo] = context.payload.repository.full_name.split('/')

  const list = await octokit.repos.listProtectedBranchRequiredStatusChecksContexts({
    owner,
    repo,
    branch,
  })
  console.log('Current status checks: ', list)
  console.log('Setting status checks to: ', context)

  const response = await octokit.repos.updateProtectedBranchRequiredStatusChecks({
    owner,
    repo,
    branch,
    contexts,
  })

  console.log({ response })

  return list
}
try {
  setStatusChecks()
}
catch (error) {
  core.setFailed(error.message)
}
