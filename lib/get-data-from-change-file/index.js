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

    const rawIncrementationType = changeFilePath.incrementation.toLowerCase()
    const hasValidIncrementationType = ['major', 'minor', 'patch'].some(incrementationType => rawIncrementationType === incrementationType)

    console.log({rawIncrementationType, hasValidIncrementationType })

    if (!rawIncrementationType && hasValidIncrementationType) {
      return core.setFailed(
        `Could not find a valid incrementation type in the change file.`
      )
    }

    core.setOutput('incrementation', changeFileData.incrementation)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()