const core = require('@actions/core')
const github = require('@actions/github')

const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const run = async () => {
  const owner = '15gifts'
  const repo = 'testaurant'
  const runId = '8003190745'

  try {
    const response = await octokit.actions.listJobsForWorkflowRun({
      owner: owner,
      repo: repo,
      run_id: runId,
    })

    const data = response.data

    // Filter the jobs with the desired step
    const successfulJobs = data.jobs.filter(job => {
      // Check if the job has a step with name "Notify Slack Cancellation" and conclusion "success"
      return job.steps.some(step => {
        return step.name === 'Notify Slack Cancellation' && step.conclusion === 'success'
      })
    })

    // Count the number of successful jobs
    const successfulJobsCount = successfulJobs.length

    // Print the count
    console.log("Number of jobs with 'Notify Slack Cancellation' step and conclusion 'success':", successfulJobsCount)

    // Print the names of jobs with successful "Notify Slack Cancellation" step
    console.log("List of jobs with 'Notify Slack Cancellation' step and conclusion 'success':")
    successfulJobs.forEach(job => {
      console.log(job.name)
    })
  }
  catch (error) {
    console.error(error)
  }
}

run()
