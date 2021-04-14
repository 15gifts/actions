const get = require('lodash.get')
const core = require('@actions/core')
const { GitHub, context } = require('@actions/github')

const [owner, repo] = context.payload.repository.full_name.split('/')

const ALLOWED_LABELS = ['patch', 'minor', 'major']

const getPullRequestNumberFromCommitMessage = () => {
  const pullRequestNumber = get(context, 'payload.number')

  if (!pullRequestNumber) core.setFailed('Failed to get pull request number')
  return pullRequestNumber
}

const getLabelsFromPullRequest = async ({ token, pullRequestNumber }) => {
  const octokit = new GitHub(token)

  const pullRequest = await octokit.pulls.get({ 
    owner,
    repo,
    pull_number: pullRequestNumber
  })

  const labels = get(pullRequest, 'data.labels', [])

  if (labels.length === 0) {
    core.setFailed(`Failed to find any labels on pull request ${pullRequestNumber}`)
  }

  return labels.map(label => label.name)
}

const getVersionLabel = async (labels) => {
  let versionLabel;

  ALLOWED_LABELS.forEach(label => { 
    if (labels.includes(label)){
      versionLabel = label
    }
  })

  if (versionLabel) {
    core.setFailed(`The list of labels did not include a valid version label. Labels found are : ${labels.join(', ')}`)
  }

  return versionLabel
}

const run = async () => {
  try {
    const token = core.getInput('github-token', { required: true })
    
    const pullRequestNumber = getPullRequestNumberFromCommitMessage()
    const labels = await getLabelsFromPullRequest({ token, pullRequestNumber })
    const versionLabel = await getVersionLabel(labels)

    core.setOutput('match', versionLabel)
    core.setOutput('labels', labels)
  } 
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
