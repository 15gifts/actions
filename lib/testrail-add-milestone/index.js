const TestRail = require('@dlenroc/testrail')

const api = new TestRail({
  host: 'https://15gifts.testrail.net',
  username: process.env.TESTRAIL_USER,
  password: process.env.TESTRAIL_API_KEY,
})

const checkForMilestone = async (projectId, milestoneName) => {
  try {
    const milestones = await api.getMilestones(projectId)
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].name.includes(milestoneName)) {
        return milestones[i].id
      }
    }
  }
  catch (error) {
    console.error(error)
  }
}

const run = async () => {
  try {
    const projectId = 8
    const milestoneName = 'r9301'

    const regex = new RegExp(`(?<!\\d)${milestoneName}(?!\\d)`)

    let milestoneId = await checkForMilestone(projectId, milestoneName)
    if (!milestoneId) {
      const milestoneResponse = await api.addMilestone(projectId, {
        name: milestoneName,
        description: `Release ${milestoneName}`,
      })
      milestoneId = milestoneResponse.id
    }

    const runs = await api.getRuns(projectId, { is_completed: 0 })

    for (let i = 0; i < runs.length; i++) {
      if (regex.test(runs[i].name) && runs[i].milestone_id === null) {
        await api.updateRun(runs[i].id, { milestone_id: milestoneId })
      }
    }
  }
  catch (error) {
    console.error(error)
  }
}

run()
