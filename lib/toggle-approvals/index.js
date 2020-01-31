const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

try {
  const approvalsCount = core.getInput('approvals_count')
  const toggle = core.getInput('toggle')

  const { payload: { ref } } = context
  const branch = ref.replace('refs/heads/', '')

  const [owner, repo] = context.payload.repository.full_name.split('/')


  if (toggle === 'off') {
    console.log('Disabling protected rules')
    octokit.repos.removeProtectedBranchPullRequestReviewEnforcement({
      owner,
      repo,
      branch,
    })
    console.log('Protected rules disabled')
  } else {
    console.log('Enabling protected rules')
    octokit.repos.updateProtectedBranchPullRequestReviewEnforcement({
      owner,
      repo,
      branch,
      required_approving_review_count: approvalsCount
    })
    console.log('Protected rules enabled')
  }

} catch (error) {
  core.setFailed(error.message);
}
