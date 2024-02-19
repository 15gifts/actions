const core = require('@actions/core')
const TestRail = require('@dlenroc/testrail')

const api = new TestRail({
  host: 'https://15gifts.testrail.net',
  username: process.env.TESTRAIL_USER,
  password: process.env.TESTRAIL_API_KEY,
})

const run = async () => {
  try {
    const projectId = core.getInput('project-id')

    const openRuns = await api.getRuns(projectId, { is_completed: 0 })

    const filteredRuns = openRuns.filter(run =>
      run.blocked_count + run.untested_count + run.retest_count + run.failed_count === 0
    )

    for (let i = 0; i < filteredRuns.length; i++) {
      await api.closeRun(filteredRuns[i].id)
    }
  }
  catch (error) {
    console.error(error)
  }
}

run()
