const core = require('@actions/core')
const github = require('@actions/github')

try {
  const token = core.getInput('github-token')
  const repo = core.getInput('repo')
  const owner = core.getInput('owner')
  const eventType = core.getInput('event-type')
  const payload = core.getInput('payload')

  const octokit = new github.GitHub(token)

  octokit.repos.createDispatchEvent({
    owner,
    repo,
    event_type: eventType,
    client_payload: payload,
  })
    .then((res) => console.log('event dispatched', res))
}
catch (error) {
  core.setFailed(error.message)
}
