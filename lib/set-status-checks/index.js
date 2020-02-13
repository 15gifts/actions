const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const { payload: { ref } } = context
const branch = ref.replace('refs/heads/', '')
const [owner, repo] = context.payload.repository.full_name.split('/')

const checks = core.getInput('checks')
console.log({ checks })

const contexts = checks ? checks.split(',') : [] // Convert string provided by YAML into an array
console.log({ contexts })

octokit.repos.listProtectedBranchRequiredStatusChecksContexts({
  owner,
  repo,
  branch,
})
  .then(({ data: checks }) => {
    console.log('Current status checks: ', checks)
    core.setOutput('checks', `${checks.toString()}`) // Cnvert to string to be used in workflow YAML

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
