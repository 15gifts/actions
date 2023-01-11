const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const branch = core.getInput('branch')
    const branchName = branch.split('/').pop()
    console.log('BRANCH')
    console.log(branchName)
    const changedFiles = JSON.parse(rawChangedFiles)
    const changeFilePath = changedFiles.find(filePath => filePath.includes(`.changes`))

    let incrementation
    let tickets
    let changes

    if (branchName === 'annie11') {
      changes = {"added":[],"changed":["Auto update develop from master"],"deprecated":[],"removed":[],"fixed":[],"security":[]}
    }
    else {
      if (!changeFilePath) {
        return core.setFailed(
          `A change file could not be found. Please ensure you have created and filled out a change file.`
        )
      }

      const rawChangeFileContents = fs.readFileSync(changeFilePath, { encoding: 'utf8' })

      const changeFileData = JSON.parse(rawChangeFileContents)

      console.log({ changeFileData })

      const { incrementation: rawIncrementation, tickets: rawTickets, changes: rawChanges } = changeFileData
      tickets = rawTickets
      changes = rawChanges
      const incrementation = rawIncrementation.toLowerCase()
      const hasValidIncrementationType = ['major', 'minor', 'patch'].some(incrementationType => incrementation === incrementationType)

      if (!incrementation || !hasValidIncrementationType) {
        return core.setFailed(
          `Could not find a valid incrementation type in the change file.`
        )
      }
    }
console.log('OUTPUT')
console.log(incrementation)
console.log(tickets)
console.log(changes)
console.log(changeFilePath)
    core.setOutput('incrementation', incrementation)
    core.setOutput('tickets', tickets)
    core.setOutput('changes', changes)
    core.setOutput('changeFile', changeFilePath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
