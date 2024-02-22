const core = require('@actions/core')
const github = require('@actions/github')

const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const run = async () => {
  const owner = '15gifts'
  const repo = 'testaurant'
  const runId = '7988223444'

  try {
    const response = await octokit.actions.listJobsForWorkflowRun({
      owner: owner,
      repo: repo,
      run_id: runId,
    })

    console.log(response.data) // Log the response data
  }
  catch (error) {
    console.error(error)
  }
}

run()
