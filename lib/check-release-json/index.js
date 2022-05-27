const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const getReleaseJsonStatus = async (releaseJsonFilePath) => {

  const releaseJsonFileContents = fs.readFileSync(releaseJsonFilePath, { encoding: 'utf8'})    
  const releaseJsonFileData = JSON.parse(releaseJsonFileContents)
  const { version, type, components, deployment } = releaseJsonFileData

  return deployment.status;
}

const run = async () => {
  try {
    const releaseJsonFilePath = core.getInput('release-json')
    const releaseJsonStatus = await getReleaseJsonStatus(releaseJsonFilePath)
    core.setOutput('status', releaseJsonStatus)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()