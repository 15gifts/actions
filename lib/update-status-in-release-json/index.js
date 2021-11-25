const fs = require('fs')
const core = require('@actions/core')

const run = async () => {
  try {
    const releaseJsonFilePath = core.getInput('release-json')
    const status = core.getInput('status')
    console.log(`releasejson: ${releaseJsonFilePath}`)
    const releaseJsonFileData = JSON.parse(fs.readFileSync(releaseJsonFilePath, { encoding: 'utf8'}))
    releaseJsonFileData.deployment.status = status
    fs.writeFileSync(releaseJsonFilePath, JSON.stringify(releaseJsonFileData));
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()