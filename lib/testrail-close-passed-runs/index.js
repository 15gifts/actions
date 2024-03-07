const core = require('@actions/core')
const TestRail = require('@dlenroc/testrail')

const run = async () => {
  try {
    const username = core.getInput('username')
    const password = core.getInput('api-key')
    const projectId = core.getInput('project-id')
    const closeAll = core.getInput('close-all')
    const milestoneName = core.getInput('milestone-name')

    const api = new TestRail({
      host: 'https://15gifts.testrail.net',
      username: username,
      password: password,
    })

    const openRuns = await api.getRuns(projectId, { is_completed: 0 })

    const milestoneFilteredRuns = openRuns.filter(run =>
      run.name.includes(milestoneName)
    )

    let filteredRuns = milestoneFilteredRuns

    if (!closeAll || closeAll.toLowerCase() === 'false') {
      filteredRuns = milestoneFilteredRuns.filter(run =>
        run.blocked_count + run.untested_count + run.retest_count + run.failed_count === 0
      )
    }

    for (let i = 0; i < filteredRuns.length; i++) {
      await api.closeRun(filteredRuns[i].id)
    }
  }
  catch (error) {
    console.error(error)
  }
}

run()