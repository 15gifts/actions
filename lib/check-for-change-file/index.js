const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)

    const hasChangeFile = changedFiles.some(filePath => filePath.includes(`.changes`));

    if (!hasChangeFile) {
      return core.setFailed(
        `A change file could not be found. Please ensure you have created and filled out a change file.`
      )
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()