const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')

//const packageFile = require(path.resolve('package.json'));

const generateReleaseData = (core) => {
  const rawdeployment = core.getInput('deployment')
  const deployment = JSON.parse(rawdeployment)
  const releasePath = core.getInput('releasePath')

  const deployFilePath = '.github/workflows/deploy_production.yml'
  console.log(`deploy file: ${deployFilePath}`);
  const deployLocalFilePath = [releasePath,'deploy_production.yml'].join('/')
  console.log(`local deploy file: ${deployLocalFilePath}`);

  const data = {
    deployment,
    deployFilePath,
    deployLocalFilePath
  }

  return data;
}

const checkRelease = async ({ deployment, deployFilePath, deployLocalFilePath }) => {

  if( ( deployment.status === 'scheduled' || deployment.status === 'cancelled' || deployment.status === 'paused') && fs.existsSync(deployFilePath)) {
    //delete file
    fs.unlink(deployFilePath, function (err) {
      if (err) {
        console.log(`Failed to delete: ${deployFilePath}`)
        return core.setFailed(
          `Failed to delete previous deploy file: ${deployFilePath}`
        )
      }
      // if no error, file has been deleted successfully
      console.log(`File: ${deployFilePath} deleted!`);
    });
  }
}

const run = async () => {
  try {
    const releaseData = generateReleaseData(core)
    await checkRelease(releaseData)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
