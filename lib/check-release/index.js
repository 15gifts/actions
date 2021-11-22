const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

//const packageFile = require(path.resolve('package.json'));

const generateReleaseData = (core) => {
  const version = core.getInput('version')
  const rawdeployment = core.getInput('deployment')
  const deployment = JSON.parse(rawdeployment)

  const deployFilePath = '.github/workflows/deploy_preproduction_' + version + '.yml'
  console.log(`release file: ${deployFilePath}`);
  const deployConfigFilePath = '.github/workflows/' + version + '.config'
  console.log(`config file: ${deployConfigFilePath}`);

  const data = {
    version,
    deployment,
    deployFilePath,
    deployConfigFilePath
  }

  return data;
}

const checkRelease = async ({ version, deployment, deployFilePath, deployConfigFilePath }) => {

  if(deployment.status === 'deploy' && fs.existsSync(deployFilePath)) {
    return core.setFailed(
      `A release has already been scheduled for this version. Please change status to update if changes required.`
    )
  }
  if( ( deployment.status === 'cancel' || deployment.status === 'update') && fs.existsSync(deployFilePath)) {
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
