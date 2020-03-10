const core = require('@actions/core')
const { exec } = require('child_process') // Lets us run commands from inside an action

const token = core.getInput('github-token')

try {
  const repo = core.getInput('repo')
  const owner = core.getInput('owner')
  const eventType = core.getInput('event-type')
  const payload = core.getInput('payload')

  const command = `curl --verbose -X POST -u "${owner}:${token}"
  -H "Accept: application/vnd.github.everest-preview+json"
  -H "Content-Type: application/json" https://api.github.com/repos/${owner}/${repo}/dispatches
  --data '{"event_type": "${eventType}", "client_payload": ${payload}'`

  exec(command)

  console.log('event dipatched')
}
catch (error) {
  core.setFailed(error.message)
}
