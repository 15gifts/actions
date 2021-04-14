const get = require('lodash.get')
const core = require('@actions/core')
const { GitHub, context } = require('@actions/github')

const [owner, repo] = context.payload.repository.full_name.split('/')

const getVersionLabel = async () => {
  const token = core.getInput('github-token', { required: true })
  
  let versionLabel = 'patch'
  const allowedLabels = ['patch', 'minor', 'major']
  
  const pullRequestNumber = getPullRequestNumberFromCommitMessage()
  const labels = await getLabelsFromPullRequest({ token, pullRequestNumber })
  
  allowedLabels.forEach(label => { 
    if (labels.includes(label)){
      versionLabel = label
    }
  })

  return versionLabel
}

const getPullRequestNumberFromCommitMessage = () => {
  const pullRequestNumber = get(context, 'payload.number', {})
  
  if (!pullRequestNumber) { 
    core.setFailed('Failed to get pull request number')
  }

  return pullRequestNumber
}

const getLabelsFromPullRequest = async ({ token, pullRequestNumber }) => {
  const octokit = new GitHub(token)

  const pullRequest = await octokit.pulls.get({ owner, repo, pull_number: pullRequestNumber })

  const labels = get(pullRequest, 'data.labels', [])

  return labels.map(label => label.name)
}

const run = async () => {
  try {
    const versionLabel = await getVersionLabel()
    core.setOutput('match', versionLabel)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
