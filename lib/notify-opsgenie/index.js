const core = require('@actions/core')
const opsgenie = require('opsgenie-sdk')

// https://docs.opsgenie.com/docs/alert-api#section-create-alert
const OPSGENIE_LIMITS = {
  message: 130,
  alias: 512,
  description: 15000,
}

try {
  opsgenie.configure({ api_key: core.getInput('api-key') })

  const jobStatus = core.getInput('job-status')
  const repoJobId = `${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_JOB}`
  const entity = core.getInput('entity')
  const message = core.getInput('message')
  const description = core.getInput('description')
  const runUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  const alias = core.getInput('alias') || repoJobId

  if (jobStatus === 'failure') {
    createAlertOnOpsGenie({ entity, alias, message, description, runUrl }).catch(error => core.setFailed(error.message))
  }
  else if (jobStatus === 'success') {
    closeAlertOnOpsGenie({ alias, runUrl, repoJobId }).catch(error => core.setFailed(error.message))
  }
}
catch (error) {
  core.setFailed(error.message)
}

async function closeAlertOnOpsGenie ({ alias, runUrl, repoJobId }) {
  const listPayload = {
    query: `status: open AND alias: ${alias}`,
    limit: 1,
  }

  const alerts = await new Promise((resolve, reject) => {
    opsgenie.alertV2.list(listPayload, (error, response) => {
      if (error) {
        reject(new Error(`Failed to list alerts on OpsGenie: ${error.message}`))
      }
      else {
        resolve(response.data)
      }
    })
  })

  // not a problem if we can't find an alert to close, it means it doesn't exist (with an open status) yet
  if (!Array.isArray(alerts) || alerts.length === 0) return

  const closeAlertId = {
    identifier: alerts[0].id,
    identifierType: 'id',
  }
  const closeArertData = {
    user: 'GitHub Action',
    source: 'GitHub Action',
    note: `Job ${repoJobId} executed successfully. Details: ${runUrl}`,
  }

  return new Promise((resolve, reject) => {
    opsgenie.alertV2.close(closeAlertId, closeArertData, error => {
      if (error) {
        reject(new Error(`Failed to close the alert on OpsGenie: ${error.message}`))
      }
      else {
        resolve()
      }
    })
  })
}

async function createAlertOnOpsGenie ({ entity, alias, message, description = '', runUrl }) {
  if (message.length > OPSGENIE_LIMITS.message) {
    description = message.substring(OPSGENIE_LIMITS.message) + (description ? `\n\n${description}` : '')
  }

  description += (description ? '\n\n' : '') + `Failed run: ${runUrl}`

  const payload = { message, description, entity, alias }

  // making sure we will not exceed the field length limits
  Object.keys(OPSGENIE_LIMITS).forEach(fieldName => {
    const maxLength = OPSGENIE_LIMITS[fieldName]
    if (typeof payload[fieldName] === 'string' && payload[fieldName].length > maxLength) {
      payload[fieldName] = payload[fieldName].substring(0, maxLength)
    }
  })

  return new Promise((resolve, reject) => {
    opsgenie.alertV2.create(payload, error => {
      if (error) {
        reject(new Error(`Failed to create alert on OpsGenie: ${error.message}`))
      }
      else {
        resolve()
      }
    })
  })
}
