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

  const manageAlert = core.getInput('manage-alert')
  const jobStatus = core.getInput('job-status')
  const entity = core.getInput('entity')
  const message = core.getInput('message')
  const description = core.getInput('description')
  const alias = getAlertAlias()

  if (jobStatus === 'failure') {
    createAlertOnOpsGenie({ entity, alias, message, description }).catch(error => core.setFailed(error.message))
  }
  else if (manageAlert && jobStatus === 'success') {
    closeAlertOnOpsGenie(alias).catch(error => core.setFailed(error.message))
  }
}
catch (error) {
  core.setFailed(error.message)
}

async function closeAlertOnOpsGenie (alias) {
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

  console.log(alerts)

  // not a problem if we can't find an alert to close, it means it doesn't exist (with an open status) yet
  if (!alerts || !alerts.length === 0) return

  const closeAlertId = {
    identifier: alerts[0].id,
    identifierType: 'id',
  }
  const closeArertData = {
    source: 'GitHub Action',
    note: `Job ${alias} executed successfully`,
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

async function createAlertOnOpsGenie ({ entity, alias, message, description = '' }) {
  if (message.length > OPSGENIE_LIMITS.message) {
    description = message.substring(OPSGENIE_LIMITS.message) + (description ? `\n\n${description}` : '')
  }

  const runUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
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

function getAlertAlias () {
  if (core.getInput('manage-alert')) {
    return `${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_JOB}`
  }
  else if (core.getInput('alias')) {
    return core.getInput('alias')
  }
  return core.getInput('message').replace(/\d+/g, 'X')
}
