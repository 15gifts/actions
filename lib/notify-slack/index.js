const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

try {
  const url = core.getInput('url')
  const channel = core.getInput('channel')
  const iconEmoji = core.getInput('icon-emoji')
  const message = core.getInput('message')
  const username = core.getInput('username')

  const [owner, repo] = context.payload.repository.full_name.split('/')
  const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`

  octokit.request({
    baseUrl: 'https://hooks.slack.com',
    url,
    method: 'POST',
    data: {
      channel,
      username,
      text: `${message} \r ${defaultUrl}`,
      icon_emoji: iconEmoji,
    }
  })

} catch (error) {
  core.setFailed(error.message);
}
