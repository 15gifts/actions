const fs = require('fs')
const core = require('@actions/core')

const run = async () => {
  try {
    const jsonFilePath = core.getInput('json-file')
    const jsonFileData = JSON.parse(fs.readFileSync(jsonFilePath, { encoding: 'utf8'}))
    core.setOutput('json-contents', jsonFileData)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()