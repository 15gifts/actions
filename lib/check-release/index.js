const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')

const generateReleaseData = (core) => {
  const rawdeployment = core.getInput('deployment')
  const deployment = JSON.parse(rawdeployment)
  const releasePath = core.getInput('releasePath')

  const deployFilePath = '.github/workflows/deploy_production.yml'
  console.log(`deploy file: ${deployFilePath}`);

  const data = {
    deployment,
    deployFilePath
  }

  return data;
}

const checkRelease = ({ deployment, deployFilePath }) => {
  console.log(`deleting...status: ${deployment.status}`)
  var delete_flag="0";
  console.log(`delete flag in func: ${delete_flag}`);
  if( ( deployment.status === 'scheduled' || deployment.status === 'cancelled' || deployment.status === 'paused') && fs.existsSync(deployFilePath)) {
    //delete file
    fs.unlinkSync(deployFilePath, function (err) {
      if (err) {
        console.log(`Failed to delete: ${deployFilePath}`)
        return core.setFailed(
          `Failed to delete previous deploy file: ${deployFilePath}`
        )
      }
      // if no error, file has been deleted successfully
      console.log(`File: ${deployFilePath} deleted!`);
      delete_flag="1";
      console.log(`delete flag in unlink: ${delete_flag}`);
    });
  }
  console.log(`delete flag before return: ${delete_flag}`);
  return delete_flag;
}

const run = () => {
  try {
    const releaseData = generateReleaseData(core)
    const delete_flag = checkRelease(releaseData)
    console.log(`delete flag in run: ${delete_flag}`);
    core.setOutput('delete-flag', delete_flag)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
