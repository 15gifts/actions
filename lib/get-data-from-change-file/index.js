const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)

    const rawChangeFilePath = changedFiles.find(filePath => filePath.includes(`.changes`));

    if (!rawChangeFilePath) {
      return core.setFailed(
        `A change file could not be found. Please ensure you have created and filled out a change file.`
      )
    }

    const changeFilePath = path.join(__dirname, rawChangeFilePath)
    console.log({changeFilePath})

    const rawChangeFileContents = fs.readFileSync(changeFilePath, { encoding: 'utf8'})
    console.log({rawChangeFileContents})

    const changeFileData = JSON.parse(rawChangeFileContents)

    console.log({changeFileData})


  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()