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

const getCurrentChecks = () =>
  octokit.repos.getProtectedBranchRequiredStatusChecks({
    owner,
    repo,
    branch,
  })

const getCurrentContexts = (getRes) => {
  console.log({ getRes })
  return octokit.repos.listProtectedBranchRequiredStatusChecksContexts({
    owner,
    repo,
    branch,
  })
}

const updateContexts = ({ data: checks = [] }) => {
  if (!checks.length) return
  console.log('Current status checks: ', checks)
  core.setOutput('checks', `${checks.toString()}`) // Cnvert to string to be used in workflow YAML

  console.log('Setting status checks to: ', contexts)
  return octokit.repos.updateProtectedBranchRequiredStatusChecks({
    owner,
    repo,
    branch,
    contexts,
  })
}

getCurrentChecks()
  .then(getCurrentContexts)
  .then(updateContexts)
  .then(res => console.log({ res }))
  .catch(e => {
    e.status === 404
      ? console.log('No status checks set, exiting')
      : core.setFailed(e.message)
  })
