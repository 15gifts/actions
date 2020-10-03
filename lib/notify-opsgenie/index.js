const core = require('@actions/core')
const github = require('@actions/github')
const opsgenie = require('opsgenie-sdk')
const context = github.context

// https://docs.opsgenie.com/docs/alert-api#section-create-alert
const OPSGENIE_LIMITS = {
  message: 130,
  alias: 512,
  description: 15000,
}

try {
  opsgenie.configure({ api_key: core.getInput('api-key') })

  const entity = core.getInput('entity')
  const message = core.getInput('message')
  const description = core.getInput('description')
  const alias = core.getInput('alias')

  const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${process.env.GITHUB_RUN_ID}`

  console.log(context.job)

  // postErrorToOpsGenie({ entity, message, description, alias })
}
catch (error) {
  core.setFailed(error.message)
}

function postErrorToOpsGenie ({ entity, message, description, alias }) {
  if (!alias) {
    // replacing all digits with an `X` to de-dupe similar errors
    alias = message.replace(/\d+/g, 'X')
  }

  const payload = { message, description, entity, alias }

  if (payload.message.length > OPSGENIE_LIMITS.message) {
    payload.description = payload.message.substring(OPSGENIE_LIMITS.message) + (payload.description ? `\n\n${payload.description}` : '')
  }

  // making sure we will not exceed the field length limits
  Object.keys(OPSGENIE_LIMITS).forEach(fieldName => {
    const maxLength = OPSGENIE_LIMITS[fieldName]
    if (typeof payload[fieldName] === 'string' && payload[fieldName].length > maxLength) {
      payload[fieldName] = payload[fieldName].substring(0, maxLength)
    }
  })

  opsgenie.alertV2.create(payload, error => {
    if (error) {
      core.setFailed(`Failed to create alert on OpsGenie: ${error.message}`)
    }
  })
}
