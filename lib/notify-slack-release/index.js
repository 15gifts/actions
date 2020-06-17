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
  const targetEnvironment = core.getInput('target-environment')
  const versionNumber = core.getInput('version-number')
  const commitSha = core.getInput('commit-sha')

  const repoUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}`
  const defaultUrl = `${repoUrl}/actions/runs/${process.env.GITHUB_RUN_ID}`

  const date = new Date()
  const dateTime = new Intl.DateTimeFormat(
    'en-GB',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }
  ).format(date)

  const payload = {
    channel,
    username,
    icon_emoji: iconEmoji,
    blocks: [
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*When:* ${dateTime}`,
        },
      },
    ],
  }

  if (versionNumber || targetEnvironment) {
    const bothExist = versionNumber && targetEnvironment

    const section = {
      type: 'section',
      'fields': [],
    }

    if (versionNumber) {
      section.fields.push({
        type: 'mrkdwn',
        text: `*Version:*${bothExist ? '\n' : ''} <${repoUrl}/releases/tag/${versionNumber}|${versionNumber}>`,
      })
    }

    if (targetEnvironment) {
      section.fields.push({
        type: 'mrkdwn',
        text: `*Environment:*${bothExist ? '\n' : ''} ${targetEnvironment}`,
      })
    }

    payload.blocks.push(section)
  }

  if (commitSha) {
    payload.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Commit SHA:* <${repoUrl}/commit/${commitSha}|${commitSha}>`
      },
    })
  }

  payload.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Run Logs:* <${defaultUrl}|${defaultUrl}>`,
    },
  })

  octokit.request({
    baseUrl: 'https://hooks.slack.com',
    url,
    method: 'POST',
    data: payload,
  })
}
catch (error) {
  core.setFailed(error.message)
}
