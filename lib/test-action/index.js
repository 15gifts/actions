const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const getCancelledRuns = async (owner, repo, runId) => {
  // debugging
  console.log('Owner:', owner)
  console.log('Repo:', repo)
  console.log('Run ID:', runId)

  try {
    const allJobs = await octokit.paginate(octokit.actions.listJobsForWorkflowRun, {
      owner: owner,
      repo: repo,
      run_id: runId,
    })

    console.log('All Jobs:', allJobs) // Debugging

    // Filter the jobs with the desired step
    const cancelledJobs = allJobs.filter(job => {
      // Check if the job has a step with name "Notify Slack Cancellation" and conclusion "success"
      return job.steps.some(step => {
        return step.name === 'Notify Slack Cancellation' && step.conclusion === 'success'
      })
    })

    console.log('Cancelled Jobs:', cancelledJobs) // Debugging

    return cancelledJobs
  }
  catch (error) {
    console.error(error)
    throw error // Re-throw the error to propagate it further if needed
  }
}

// Wrap the call in an async function and then call that function
async function test () {
  await getCancelledRuns(context.repo.owner, context.repo.repo, process.env.GITHUB_RUN_ID)
}

// Call the async function
test()
