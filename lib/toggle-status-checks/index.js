const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const toggleApprovals = async () => {
  const approvalsCount = core.getInput('approvals_count')
  const toggle = core.getInput('toggle')
  const contexts = core.getInput('checks')

  const { payload: { ref } } = context
  const branch = ref.replace('refs/heads/', '')

  const [owner, repo] = context.payload.repository.full_name.split('/')

  const list = await octokit.repos.listProtectedBranchRequiredStatusChecksContexts({
    owner
    repo
    branch
  })

  let response
  if (toggle === 'off') {
    console.log('Disabling protected rules')
    response = await octokit.repos.updateProtectedBranchRequiredStatusChecks({
      owner
      repo
      branch
      contexts,
    })
    console.log('Protected rules disabled')
  } else {
    console.log('Enabling protected rules')
    response = await octokit.repos.updateProtectedBranchRequiredStatusChecks({
      owner
      repo
      branch
      contexts,
    })
    console.log('Protected rules enabled')
  }
  return list
}
try {
  await toggleApprovals()
} catch (error) {
  core.setFailed(error.message);
}
