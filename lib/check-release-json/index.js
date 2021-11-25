const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const checkReleaseJsonStatus = async (releaseJsonFilePath) => {

  const releaseJsonFileContents = fs.readFileSync(releaseJsonFilePath, { encoding: 'utf8'})    
  const releaseJsonFileData = JSON.parse(releaseJsonFileContents)
  const { version, type, components, deployment } = releaseJsonFileData
  if(deployment.status === 'cancelled' || deployment.status === 'paused') {
    console.log(`Deployment has been ${deployment.status}.`)
    return core.setFailed(
      `Deployment has been ${deployment.status}.`
    )
  }
  return deployment.status;
}

const run = async () => {
  try {
    const releaseJsonFilePath = core.getInput('release-json')
    const releaseJsonStatus = await checkReleaseJsonStatus(releaseJsonFilePath) 
    core.setOutput('status', releaseJsonStatus)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()