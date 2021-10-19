const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)
    const changeFilePath = changedFiles.find(filePath => filePath.includes(`.changes`));
    
    if (!changeFilePath) {
      return core.setFailed(
        `A change file could not be found. Please ensure you have created and filled out a change file.`
      )
    }

    const rawChangeFileContents = fs.readFileSync(changeFilePath, { encoding: 'utf8'})
    
    const changeFileData = JSON.parse(rawChangeFileContents)

    console.log({changeFileData})

    const { incrementation: rawIncrementation, tickets, changes } = changeFileData
    const incrementation = rawIncrementation.toLowerCase()
    const hasValidIncrementationType = ['major', 'minor', 'patch'].some(incrementationType => incrementation === incrementationType)

    console.log({ incrementation, hasValidIncrementationType })

    if (!incrementation && hasValidIncrementationType) {
      return core.setFailed(
        `Could not find a valid incrementation type in the change file.`
      )
    }
    
    core.setOutput('incrementation', incrementation)
    core.setOutput('tickets', tickets)
    core.setOutput('changes', changes)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()