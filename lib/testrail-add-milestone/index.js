const core = require('@actions/core')
const TestRail = require('@dlenroc/testrail')

const checkForMilestone = async (api, projectId, milestoneName) => {
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

function getCurrentDateTime () {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`
  return dateTimeString
}

const run = async () => {
  try {
    const username = core.getInput('username')
    const password = core.getInput('api-key')
    const projectId = core.getInput('project-id')
    const milestoneName = core.getInput('milestone-name')
    const dateTime = getCurrentDateTime()

    const api = new TestRail({
      host: 'https://15gifts.testrail.net',
      username: username,
      password: password,
    })

    const regex = new RegExp(`(?<!\\d)${milestoneName}(?!\\d)`)

    let milestoneId = await checkForMilestone(api, projectId, milestoneName)
    if (!milestoneId) {
      const milestoneResponse = await api.addMilestone(projectId, {
        name: milestoneName,
        description: dateTime,
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
