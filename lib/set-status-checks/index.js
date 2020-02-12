const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const contexts = JSON.parse(core.getInput('checks'))

const { payload: { ref } } = context
const branch = ref.replace('refs/heads/', '')

const [owner, repo] = context.payload.repository.full_name.split('/')

octokit.repos.listProtectedBranchRequiredStatusChecksContexts({
  owner,
  repo,
  branch,
})
  .then(({ data: checks }) => {
    console.log('Current status checks: ', checks)
    core.setOutput('checks', `${checks}`)

    console.log('Setting status checks to: ', contexts)

    return octokit.repos.updateProtectedBranchRequiredStatusChecks({
      owner,
      repo,
      branch,
      contexts,
    })
  })
  .then(res => {
    console.log({ res })
  })
  .catch(e => core.setFailed(e.message))
