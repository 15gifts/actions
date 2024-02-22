const core = require('@actions/core')
const TestRail = require('@dlenroc/testrail')

const github = require('@actions/github')

const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const checkForMilestone = async (api, projectId, milestoneName) => {
  try {
    const milestones = await api.getMilestones(projectId)
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].name.includes(milestoneName)) {
        return milestones[i]
      }
    }
  }
  catch (error) {
    console.error(error)
  }
}

const passPercentage = (run) => {
  const total = run.blocked_count + run.untested_count + run.retest_count + run.failed_count + run.passed_count
  return Math.round(run.passed_count / total * 100)
}

const lookupEmoji = (name) => {
  switch (name) {
    case 'ee': return ':ee_logo:'
    case 'o2': return ':o2_logo:'
    case 'spectrum': return ':spectrum_logo:'
    case 'tesco': return ':tesco_logo:'
    case 'three': return ':three_logo:'
    case 'tmobile': return ':tmobile_logo:'
    case 'vodafoneuk': return ':vodafoneuk_logo:'
    case 'vodafoneukmedia': return ':vodafoneukmedia:'
    case 'vzw': return ':vzw_logo:'
    case 'vzh': return ':vzh_logo:'
    case 'vzwb': return ':vzwb_logo:'
  }
}

const constructPayload = (channel, iconEmoji, username, milestone, actionLink, passedRuns, failedRuns) => {
  const payload = {
    'channel': channel,
    'username': username,
    'icon_emoji': iconEmoji,
    'blocks': [
      {
        'type': 'header',
        'text': {
          'type': 'plain_text',
          'text': `${milestone.name}`,
          'emoji': true,
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': `*<${milestone.url}|Testrail>* | *<${actionLink}|Github>*`,
        },
      },
      {
        'type': 'context',
        'elements': [
          {
            'type': 'mrkdwn',
            'text': `:white_check_mark: *Passed : ${passedRuns.length}*`,
          },
          {
            'type': 'mrkdwn',
            'text': `:x: *Failed : ${failedRuns.length}*`,
          },
          {
            'type': 'mrkdwn',
            'text': `:mag: *Total : ${passedRuns.length + failedRuns.length}*`,
          },
        ],
      },
      {
        'type': 'divider',
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': `*Runs without 100% pass rate:*`,
        },
      },
    ],
  }

  // Construct sections for failed runs
  failedRuns.forEach(run => {
    payload.blocks.push({
      'type': 'context',
      'elements': [{
        'type': 'mrkdwn',
        'text': `${lookupEmoji(run.name.split(':')[0].split(' ')[0])}`,
      },
      {
        'type': 'mrkdwn',
        'text': `<${run.url}|${run.name.split(':')[0]}>`,
      },
      {
        'type': 'mrkdwn',
        'text': `${passPercentage(run)}%`,
      },
      ],
    })
  })
  return payload
}

const sendToSlack = async (url, payload) => {
  try {
    octokit.request({
      baseUrl: 'https://hooks.slack.com',
      url,
      method: 'POST',
      payload,
    })
  }
  catch (error) {
    console.error('Error sending Slack notification:', error.message)
  }
}

const run = async () => {
  try {
    // slack inputs
    const url = core.getInput('url')
    const channel = core.getInput('channel')
    const iconEmoji = core.getInput('icon-emoji')
    const username = core.getInput('username')

    // testrail inputs
    const testRailUsername = core.getInput('testrail-username')
    const testRailPassword = core.getInput('testrail-api-key')
    const projectId = core.getInput('project-id')
    const milestoneName = core.getInput('milestone-name')

    // create testrail api instance
    const api = new TestRail({
      host: 'https://15gifts.testrail.net',
      username: testRailUsername,
      password: testRailPassword,
    })

    // get milestone id from name
    const milestone = await checkForMilestone(api, projectId, milestoneName)

    const milestoneId = milestone.id

    if (!milestoneId) {
      console.log(`Milestone ${milestoneName} not found`)
      return
    }

    // get runs for milestone
    const runs = await api.getRuns(projectId, { milestoneId: milestoneId })

    const passedRuns = []
    let failedRuns = []

    // sort runs into passed and failed
    runs.forEach(run => {
      if (run.blocked_count + run.untested_count + run.retest_count + run.failed_count === 0) {
        passedRuns.push(run)
      }
      else {
        failedRuns.push(run)
      }
    })

    failedRuns = failedRuns.sort((a, b) => a.name.localeCompare(b.name))

    // construct payload
    const payload = constructPayload(channel, iconEmoji, username, milestone, passedRuns, failedRuns)

    sendToSlack(url, payload)
  }
  catch (error) {
    console.error(error)
  }
}

run()